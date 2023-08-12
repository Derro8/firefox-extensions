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

def xpidir(path, version):
    ziph = zipfile.ZipFile(f"{directory}\\builds\\{os.path.basename(directory)}-{version}.xpi", "w")
    for root, dirs, files in os.walk(path):
        if "builds" in root:
            continue
        
        # with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zip_ref:
    # for folder_name, subfolders, filenames in os.walk(name):
        for filename in files:
            file_path = os.path.join(root, filename)
            ziph.write(file_path, arcname=file_path.replace(directory, ""))

if os.path.exists(directory) and os.path.isdir(directory):
    with open(f"{directory}\\manifest.json", "r") as f:
        js: dict = json.loads(f.read())

        if(os.path.exists(f"{directory}\\builds\\{os.path.basename(directory)}-{js['version']}.xpi")):
            versions = js["version"].split(".")
            last_version = int(versions[len(versions) - 1])

            if(last_version + 1 >= 1000): # will probably never happen but just incase.
                second_last_version = int(versions[len(versions) - 2])
                last_version = -1
                versions[len(versions) - 2] = str(second_last_version + 1)

            versions[len(versions) - 1] = str(last_version + 1)

            js["version"] = ".".join(versions)
            with open(f"{directory}\\manifest.json", "w") as fw:
                fw.write(json.dumps(js, indent=4))

        xpidir(f"{directory}", js["version"])
