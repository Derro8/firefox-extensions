from enum import Enum

import re

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
        return Color[cprint.color_ids[color_id]] or Color.RESET

class cprint:
    
    def __init__(self):
        self.used_color_codes: dict[str, Color] = {}
        
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
            color: Color = Color.get_color(int(id))
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
            color: Color = Color.get_color(int(id))
            self.used_color_codes[color.name] = color
            text = text[:span[0] - sub] + str(color) + text[span[1] - sub:]
            sub += (span[1] - span[0]) - len(str(color))

        return input(text)
