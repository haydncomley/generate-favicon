# Generate Favicon
Generate favicons quickly using Google's Material Symbols & Icons.

1. Browse through [Google Icons](https://fonts.google.com/icons?icon.size=24&icon.color=%23e8eaed) to find an icon you like, take note of the `Icon name`
2. Simply run `npx generate-favicon --icon="<icon-name>" --pretty`

## Options
- `icon` (Required `string`) : Icon name 
- `out` (Optional `string`) : Place to put file, relative to cwd. (Default: `./icon.png`)
- `pretty` (Optional `bool`) : Generate a nice background/foreground for the icon.
- `fg` (Optional `hex`) : Colour to use for the icon (Default: `#ffffff`)
- `gb` (Optional `hex`) : Colour to use for the background (Default: `#000000`)
