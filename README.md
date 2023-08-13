
# Firefox Extensions

A repo for my firefox extensions.




## Installation

Download source:

    git clone https://github.com/Derro8/firefox-extensions.git
    cd firefox-extensions
    git submodule update


## Tools

Create Extension:

    py tools/build.py --create --name "Example Extension" --description "This is an example extension." --version "0.0.1" --manifest-version 2 --permsission webRequests,unlimitedStorage

Edit Extension:

    py tools/build.py --edit --name "Example Extension" --description "This is an example of changing the description." --version 0.0.2

Update Extension:

    py tools/build.py --update --name "Crunchyroll Profles"


## Contributing

Contributing would be appreciated.

I would be glad to have people critique my work and show me a better way to script in JavaScript, I'm quite new to it.

