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
| `vexxo-uploader.py` | Uploader app — keeps your downloads alive on Buzzheavier |

## Buzzheavier

Downloads are hosted on buzzheavier.com.

A true direct link looks like `https://ts.buzzheavier.com/d/<id>?v=<long token>` — the
one the download page's **Copy download link** button gives you. It is signed, so it
cannot be guessed from the file id and it can stop working after a while.

**Use the uploader app** to get those links and keep them alive:

```
python vexxo-uploader.py
```

It opens a control panel in your browser.

1. Open **Settings**, fill in your GitHub token and Buzzheavier account ID.
2. Press **Choose file** on a mod and pick its .jar. It uploads, fetches the direct
   link and puts it on your site. The uploader keeps a copy in `vexxo-files/`, so you
   never have to find that file again.
3. Switch **Auto** on for that mod, then turn the **Schedule** on.

From then on it does two jobs by itself:

- **Refresh the link** (every 6 hours by default) — fetches a fresh signed link for the
  file already on Buzzheavier. Quick, and no re-upload.
- **Re-upload the file** (every 2 days by default) — uploads the saved copy again.

Both intervals are dropdowns. Press **Check** on a mod at any time to see whether its
current link still downloads.

The admin panel's **Files** tab can also upload to Buzzheavier, but a web page is not
allowed to fetch the signed link, so it can only set the `buzzheavier.com/<id>/download`
form. Use the uploader for direct links.

The schedule only runs while the uploader is open. Settings live in
`vexxo-uploader.json` next to the script; neither that file nor `vexxo-files/`
belongs in the repo.

Made by Jimmy & John Co
