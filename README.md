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

Downloads are hosted on buzzheavier.com. Four kinds of link can go on the site,
picked in the uploader under **Settings → What link goes on your site**:

| Style | Looks like | Notes |
|---|---|---|
| Direct download | `ts.buzzheavier.com/d/<id>?v=…` | Starts the file straight away. Signed, so it can run out. |
| Signed link | `buzzheavier.com/<id>/download?t=…` | Also signed. |
| Plain download link | `buzzheavier.com/<id>/download` | Always works, never expires. |
| Buzzheavier page | `buzzheavier.com/<id>` | Visitors click twice. |

The first two have to be fetched from Buzzheavier each time, and Buzzheavier only
hands them to a real browser — so the uploader is often refused. When that happens it
still publishes the plain link, so a mod is never left without a download, and tells
you in the activity log.

To use a direct link anyway, press **Open page** on the mod, use Buzzheavier's own
**Copy download link** button, then press **Paste link**. The mod is tagged *Pasted by
hand* and the schedule leaves it alone.

## The uploader

```
python vexxo-uploader.py
```

Opens a control panel in your browser.

1. **Settings** — GitHub token, Buzzheavier account ID, link style.
2. **Choose file** on a mod. It uploads, sets the link, and keeps a copy in
   `vexxo-files/` so you never have to find that file again.
3. Switch **Auto** on for that mod, then turn the **Schedule** on.

It then does two jobs on its own:

- **Refresh the link**, every 6 hours by default — only matters for the signed styles.
- **Re-upload the file**, every 2 days by default, from the saved copy.

**Check** on a mod tells you whether its current link still downloads.

The schedule only runs while the uploader is open. `vexxo-uploader.json` and
`vexxo-files/` stay on your computer — don't put them in the repo.

Made by Jimmy & John Co
