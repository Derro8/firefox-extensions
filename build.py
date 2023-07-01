import shutil
import sys
import os
import json
import zipfile

args: list[str] = sys.argv[1:]

directory: str = ""

if len(args) > 0:
    directory = args[0]
else:
    directory = input("Extension folder: ")

if os.path.exists(directory) and os.path.isdir(directory):
    with open(f"{directory}\\manifest.json", "r") as f:
        js: dict = json.loads(f.read())

        if(os.path.exists(f"{directory}\\builds\\{os.path.basename(directory)}-{js['version']}.xpi")):
            versions = js["version"].split(".")
            last_version = versions[len(versions) - 1]

            versions[len(versions) - 1] = str(int(last_version) + 1)

            js["version"] = ".".join(versions)
            with open(f"{directory}\\manifest.json", "w") as fw:
                fw.write(json.dumps(js, indent=4))

        shutil.make_archive(f"{directory}\\builds\\{os.path.basename(directory)}-{js['version']}", "zip", directory)
        with zipfile.ZipFile(f"{directory}\\builds\\{os.path.basename(directory)}-{js['version']}.zip", "r") as zip:
            with zipfile.ZipFile(f"{directory}\\builds\\{os.path.basename(directory)}-{js['version']}.xpi", "w") as xpi:
                for info in zip.filelist:
                    buffer = zip.read(info.filename)
                    if info.filename[:7] != "builds/":
                        xpi.writestr(info, buffer)
        
        os.remove(f"{directory}\\builds\\{os.path.basename(directory)}-{js['version']}.zip")

        # os.rename(f"{directory}\\{os.path.basename(directory)}-{js['version']}.zip", f"{directory}\\{os.path.basename(directory)}-{js['version']}.xpi")