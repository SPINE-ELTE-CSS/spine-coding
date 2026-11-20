"""Rebuild index.html from src/ (python build.py)."""
import pathlib
s = pathlib.Path(__file__).parent / 'src'
cfg = ('const CONFIG = { url: "https://dxywaiqbtrpzhorhtwlq.supabase.co", key: "sb_publishable_WCm_mbRourP24J1nJLBF_A_jl9gmG-K" };\n'
       'const BUNDLED_CODEBOOK = ' + (s / 'codebook_v11.json').read_text() + ';')
agr = (s / 'agreement.js').read_text().replace("if (typeof module !== 'undefined') module.exports = AGR;", '')
out = ((s / 'template.html').read_text().replace('/*__CONFIG__*/', cfg)
       .replace('/*__AGREEMENT__*/', agr).replace('/*__APP__*/', (s / 'app.js').read_text()))
(pathlib.Path(__file__).parent / 'index.html').write_text(out)
print('index.html written')
