import shutil
import sys
import os
import json

args: list[str] = sys.argv[1:]

directory: str = ""

if len(args) > 0:
    directory = args[0]
else:
    directory = input("Extension folder: ")

if os.path.exists(directory) and os.path.isdir(directory):
    with open(f"{directory}\\manifest.json", "r") as f:
        js: dict = json.loads(f.read())
        
        shutil.make_archive(f"{directory}\\{os.path.basename(directory)}-{js['version']}", "zip", directory)
        os.rename(f"{directory}\\{os.path.basename(directory)}-{js['version']}.zip", f"{directory}\\{os.path.basename(directory)}-{js['version']}.xpi")
