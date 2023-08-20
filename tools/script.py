import argparse
import os
import json

parser = argparse.ArgumentParser(
    prog = "FJS Script Generator",
    description = "Generates a JS script with headers.",
)

VERSION = "0.0.1"

parser.add_argument("headers", help="The headers to include in the script. Split them with ,")
parser.add_argument("project", help="The project the headers will be generated at.")

args = parser.parse_args()

_directory = __file__.split("\\")[::-1]
    
_directory.pop(0)

directory = "/".join(_directory[::-1])

_directory.pop(0)

dir = "/".join(_directory[::-1])

project = dir + "/projects/" + args.project

if not os.path.exists(project + "/include"):
    os.mkdir(project + "/include")
if not os.path.exists(project + "/source"):
    os.mkdir(project + "/source")

with open(project + "/include/header.js", "w") as f:
    headers = args.headers.split(",")
    result = "/********************************\n\n\tHeaders:\n"
    
    script_chunks = []     
    
    for header in headers:
        result += "\n\t" + header + ","
        with open(directory + "/headers/" + header + ".js", "r") as fr:
            script_chunks.append(fr.read())
    
    result = result.rstrip(",")
    
    result += "\n\n********************************/"
    
    result += "\n\nexport const version = \""+ VERSION +"\"\n\n" + "\n\n".join(script_chunks)
    
    f.write(result)
    
with open(project + "/source/main.js", "w") as f:
    f.write("""(async () => {
    imports = await import("../include/header.js");

    // Write your code here.
    
})();""")
