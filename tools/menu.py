from typing import Any
from enum import Enum

import os
import math
import re

class cprint:
    class Color(Enum):
        BLACK = "\033[30m"
        RED = "\033[31m"
        GREEN = "\033[32m"
        YELLOW = "\033[33m"
        BLUE = "\033[34m"
        MAGENTA = "\033[35m"
        CYAN = "\033[36m"
        LIGHT_GRAY = "\033[37m"
        DARK_GRAY = "\033[90m"
        LIGHT_RED = "\033[91m"
        LIGHT_GREEN = "\033[92m"
        LIGHT_YELLOW = "\033[93m"
        LIGHT_BLUE = "\033[94m"
        LIGHT_MAGENTA = "\033[95m"
        LIGHT_CYAN = "\033[96m"
        WHITE = "\033[97m"
        BOLD = "\033[1m"
        UNDERLINE = "\033[4m"
        REVERSE = "\033[7m"
        NO_UNDERLINE = "\033[24m"
        NO_REVERSE = "\033[27m"
        RESET = "\033[0m"
        RESET_ALL = "\033[0m\033[1m\033[4m\033[7m\033[24m\033[27m"
        
        def __str__(self):
            return self.value
        
        @staticmethod
        def get_color(color_id: int):
            return cprint.Color[cprint.color_ids[color_id]] or cprint.Color.RESET
    
    def __init__(self):
        self.used_color_codes: dict[str, cprint.Color] = {}
        
    color_ids: list[str] = [
        "BLACK",
        "RED",
        "GREEN",
        "YELLOW",
        "BLUE",
        "MAGENTA",
        "CYAN",
        "LIGHT_GRAY",
        "DARK_GRAY",
        "LIGHT_RED",
        "LIGHT_GREEN",
        "LIGHT_YELLOW",
        "LIGHT_BLUE",
        "LIGHT_MAGENTA",
        "LIGHT_CYAN",
        "WHITE",
        "BOLD",
        "UNDERLINE",
        "REVERSE",
        "NO_UNDERLINE",
        "NO_REVERSE",
        "RESET",
        "RESET_ALL"
    ]
    def print(self, text: str):
        """Prints the text with the color codes given.

        
        Color codes:
        Black: $0
        Red: $1
        Green: $2
        Yellow: $3
        Blue: $4
        Magenta: $5
        Cyan: $6
        Light gray: $7
        Dark gray: $8
        Light red: $9
        Light green: $10
        Light yellow: $11
        Light blue: $12
        Light magenta: $13
        Light cyan: $14
        White: $15
        Bold: $16
        Underline: $17
        Reverse: $18  
        No underline: $19
        No reverse: $20
        Reset: $21

        Args:
            text (str): Text that will be printed.
        """

        regex = re.compile(r"\$[0-9]+", re.IGNORECASE) 
        
        sub = 0
        
        for match in regex.finditer(text):
            span: list[int] = match.span()
            id: str = match.group(0)[1:]
            color: cprint.Color = cprint.Color.get_color(int(id))
            self.used_color_codes[color.name] = color
            text = text[:span[0] - sub] + str(color) + text[span[1] - sub:]
            sub += (span[1] - span[0]) - len(str(color))

        print(text)
        
    def input(self, text: str) -> str | None:
        """Prints the text with the color codes given and gets input.

        
        Color codes:
        Black: $0
        Red: $1
        Green: $2
        Yellow: $3
        Blue: $4
        Magenta: $5
        Cyan: $6
        Light gray: $7
        Dark gray: $8
        Light red: $9
        Light green: $10
        Light yellow: $11
        Light blue: $12
        Light magenta: $13
        Light cyan: $14
        White: $15
        Bold: $16
        Underline: $17
        Reverse: $18  
        No underline: $19
        No reverse: $20
        Reset: $21

        Args:
            text (str): Text that will be printed.
        """
        
        regex = re.compile(r"\$[0-9]+", re.IGNORECASE) 
        
        sub = 0
        
        for match in regex.finditer(text):
            span: list[int] = match.span()
            id: str = match.group(0)[1:]
            color: cprint.Color = cprint.Color.get_color(int(id))
            self.used_color_codes[color.name] = color
            text = text[:span[0] - sub] + str(color) + text[span[1] - sub:]
            sub += (span[1] - span[0]) - len(str(color))

        return input(text)
        
        
        

class choice:
    def __init__(self, identifier: int, name: str, callback: callable):
        
        """A class to represent a choice in a menu.

        Args:
            identifier (int): The identifier of the choice in the menu.
            name (str): The title that will be displayed in the menu.
            callback (callable): Callback function that will be called when the choice is selected.
        """
        
        self.name: str = name
        self.identifier: int = identifier
        self.is_selected: bool = False
        self.is_enabled: bool = True
        self.callback: callable = callback
        
    def __call__(self, *args: Any, **kwds: Any) -> Any:
        """Calls the callback function of the choice."""
        
        self.callback(*args, **kwds)
        
        

class menu:
    def __init__(self, title: str, choices: list[choice] = []):
        """Makes a menu with choices.

        Args:
            choices (list[choice]): choices that will be displayed in the menu.
        """
        self.title = title
        self.choices: list[choice] = choices
        
    def add_choice(self, choice: choice):
        """Creates a new choice and adds it to the menu.

        Args:
            choice (choice): The choice that will be added to the menu.
        """
    
        self.choices.append(choice)
    
    def draw_menu(self, choices: list[choice] = []):
        """Draws the menu."""
        
        self.choices = len(choices) > 0 and choices or self.choices
        
        os.system('cls' if os.name == 'nt' else 'clear')
        
        console = cprint()
        
        longest_length = max([len(choice.name) for choice in self.choices])
        console.print(f"  {(' ' * (math.floor(longest_length / 2) - math.floor(len(self.title) / 2)))}{self.title}$21")
        console.print(f"$16  {('-' * (longest_length + 1))}$21")
        
        for i, choice in enumerate(self.choices):
            console.print(f" {i + 1}. {choice.name}")
            
        console.print(f"$16  {('-' * (longest_length + 1))}$21")
        
        choice = console.input("Select an option: ")
        
        index = int(choice) - 1
        
        if(self.choices[index].is_enabled):
            self.choices[index].is_selected = True
            self.choices[index].callback()
        
                
main_menu = menu("Extension Tools")

build_menu = menu("Build Tool", [
    choice(1, "Update", lambda: print("Option 1 selected!")),
    choice(2, "Build", lambda: print("Option 2 selected!")),
    choice(3, "Edit", lambda: print("Option 3 selected!")),
    choice(4, "Create", lambda: print("Option 4 selected!")),
    choice(5, "Exit", main_menu.draw_menu)
])

headers_menu = menu("Headers Tool", [
    choice(1, "Add Header", lambda: print("Option 1 selected!")),
    choice(2, "Remove Header", lambda: print("Option 2 selected!")),
    choice(3, "Exit", main_menu.draw_menu)
])

main_menu.draw_menu([
    choice(1, "Build", build_menu.draw_menu),
    choice(2, "Headers", headers_menu.draw_menu),
])