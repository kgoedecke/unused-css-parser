# unused-css-parser
This tool scans a directory for CSS classes specified in a CSS file and thus helps you to find unused CSS classes.

## Usage
- `yarn install`
- `npm start -- --cssfile=path/to/cssfile --directory=path/to/folder/with/files`

## Example Output

```
$ npm start -- --cssfile=/someProject/application.css --directory=/someProject/

> unused-css-parser@1.0.0 start /workspace/unused-css-parser
> node index.js "--cssfile=/someProject/application.css --directory=/someProject/"

Scanning for .non-existing-class
Scanning for .form-control
Your class was found in file: /someProject/inc/shortcodes.php
Scanning for .header__icon
Your class was found in file: /someProject/file1.php
Your class was found in file: /someProject/file2.php
Your class was found in file: /someProject/dir/file3.php
Your class was found in file: /someProject/dir/subdir/file4.php
```

## Copyright
- Kevin Goedecke
