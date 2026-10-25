# VexxosMods website

Live site: https://vexxodevs.github.io/vexmods/
Admin panel: https://vexxodevs.github.io/vexmods/admin.html

## Editing the site
Use the **admin panel** to:
- replace a mod's download file (drag the new .jar onto the mod)
- edit names, descriptions, badges, icons and colours
- add, remove or reorder mods
- change the announcement bar, Discord/YouTube links and the seasonal theme
- choose where downloads are stored (**Files** tab): in this repo, or on Buzzheavier

Changes go live about a minute after you press **Publish**.

## Files
| File | What it is |
|---|---|
| `index.html`, `style.css`, `script.js` | The main site |
| `terms.html` | Terms & disclaimer page |
| `admin.html` | Admin panel |
| `site-data.json` | Mods + settings (edited by the admin panel) |
| `site-theme.js` | Theme setting (edited by the admin panel) |
| `downloads/` | Mod files, when the Files tab is set to "On this site" |
| `vexxo-upload.py` | Desktop uploader — use it if the browser can't reach Buzzheavier |

## Buzzheavier
In the admin panel, open **Files** and pick **Buzzheavier**. Drop a .jar on a mod
and press Publish: the file goes to Buzzheavier and the download link is filled in
for you. Press **Test** on the mod to check the link actually downloads.

If publishing says the browser could not reach Buzzheavier, run the uploader on
your computer instead:

```
python vexxo-upload.py Glazed-1.21.11-v20.jar
```

It uploads the file, prints the link, and can set it on the mod for you.

Made by Jimmy & John Co
