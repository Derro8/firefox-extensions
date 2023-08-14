from typing import Any

import os
import math

from cprint import cprint

console = cprint()
    
console.print("$1Hello$0, $2World$0, $3o")

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

# main_menu.draw_menu([
#     choice(1, "Build", build_menu.draw_menu),
#     choice(2, "Headers", headers_menu.draw_menu),
# ])