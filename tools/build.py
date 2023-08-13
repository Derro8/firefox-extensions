import argparse
import zipfile
import os
import json

VERSION_MAX = 1000 # Max for version numbers.

def xpidir(name, path, version):
    ziph = zipfile.ZipFile(f"{path}\\builds\\{name}-{version}.xpi", "w")
    
    for root, dirs, files in os.walk(path):
        if "builds" in root:
            continue
        
        for filename in files:
            file_path = os.path.join(root, filename)
            ziph.write(file_path, arcname=file_path.replace(path, ""))

parser = argparse.ArgumentParser(
    prog = "Firefox Extension Builder",
    description = "This script is for creating or controlling a Firefox extension."
)

mode = parser.add_mutually_exclusive_group(required=True)

mode.add_argument("-b", "--build", action="store_true", help="Build the extension.")
mode.add_argument("-u", "--update", action="store_true", help="Update the extension.")
mode.add_argument("-c", "--create", action="store_true", help="Create the extension.")
mode.add_argument("-e", "--edit", action="store_true", help="Edit the extension.")

extension_info = parser.add_argument_group("Extension Information")

extension_info.add_argument("-n", "--name", type=str, help="The name of the extension.", required=True)
extension_info.add_argument("-v", "--version", default="0.0.1", type=str, help="The version of the extension.")
extension_info.add_argument("-d", "--description", default="No description was given.", type=str, help="The description of the extension.")
extension_info.add_argument("-bs", "--background-script", default="", type=str, help="Adds a script to the background.")
extension_info.add_argument("-p", "--permission", type=str, default="", help="Adds a permission to the extension.")
extension_info.add_argument("-m", "--manifest-version", type=int, default=2, help="Sets the manifest version.")

args = parser.parse_args()

directory = os.path.dirname(os.path.realpath(__file__))

match(args.build, args.create, args.edit, args.update):
    case (True, False, False, False):
        print("Building the extension...")
        
        with open(f"{directory}\\{args.name}\\manifest.json", "r") as f:
            manifest = json.load(f)
        
        manifest["version"] = args.version
        
        with open(f"{directory}\\{args.name}\\manifest.json", "w") as f:
            json.dump(manifest, f, indent=4)
        
        xpidir(args.name, f"{directory}\\{args.name}", args.version)
        
    case (False, True, False, False):
        print("Creating the extension...")
        
        permissions = args.permission.split(",")
        if(permissions[0] == ""):
            permissions = []
            
        background_script = args.background_script.split(",")
        if(background_script[0] == ""):
            background_script = []
        
        manifest = {
            "name": args.name,
            "version": args.version,
            "description": args.description,
            "manifest_version": args.manifest_version,
            "background": {
                "scripts": background_script,
                "persistent": True
            },
            "permissions": permissions
        }
        
        os.mkdir(f"{directory}\\{args.name}")
        
        with open(f"{directory}\\{args.name}\\manifest.json", "w") as f:
            json.dump(manifest, f, indent=4)

    case (False, False, True, False):
        print("Editing the extension...")
        
        with open(f"{directory}\\{args.name}\\manifest.json", "r") as f:
            manifest = json.load(f)
        
        if(args.description != manifest["description"] and args.description != "No description was given."):
            manifest["description"] = args.description
        
        if(args.version != manifest["version"] and args.version != "0.0.1"):
            manifest["version"] = args.version
        
        if(args.manifest_version!= manifest["manifest_version"] and args.manifest != 2):
            manifest["manifest_version"] = args.manifest_version
            
        if(args.background_script!= ""):
            for script in args.background_script.split(","):
                manifest["background"]["scripts"].append(script)
        
        if(args.permission!= ""):
            for permission in args.permission.split(","):
                manifest["permissions"].append(permission)
        
        print(json.dumps(manifest, indent=4))
        
        with open(f"{directory}\\{args.name}\\manifest.json", "w") as f:
            json.dump(manifest, f, indent=4)
        
    case (False, False, False, True):
        print("Updating the extension...")
        
        with open(f"{directory}\\{args.name}\\manifest.json", "r") as f:
            manifest = json.load(f)
        
        reverse_versions = manifest["version"].split(".")[::-1]
        
        index = 0
        
        for version in reverse_versions:
            if int(version) >= VERSION_MAX:
                reverse_versions[index] = "0"
                reverse_versions[index + 1] = str(reverse_versions[index + 1] + 1)
            else:
                reverse_versions[index] = str(int(version) + 1)
                break
            index += 1
        
        manifest["version"] = ".".join(reverse_versions[::-1])
        
        with open(f"{directory}\\{args.name}\\manifest.json", "w") as f:
            json.dump(manifest, f, indent=4)
        
        xpidir(args.name, f"{directory}\\{args.name}", manifest["version"])
