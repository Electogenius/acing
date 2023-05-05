var e = ace.edit("editor");
var settings = {
	horizmode: false,
	mode: "html",
	preview: {
		pre: "",
		post: "",
	},
	live: true,
	autosave: 3,
	font: {
		size: 12,
		family: "monospace"
	},
	eruda: true,
}
if (localStorage.getItem("settings") === null) {
	localStorage.setItem("settings", JSON.stringify(settings))
} else {
	settings = JSON.parse(localStorage.getItem("settings") ?? {})
}

//pe.setTheme("ace/theme/" + settings.theme);
e.session.setMode("ace/mode/" + settings.mode);

window.addEventListener("DOMContentLoaded",()=>{
	let Emmet = require("ace/ext/emmet");
	e.setOption("enableEmmet", true);
})

function save() {
	localStorage.setItem("code", e.getValue());
	localStorage.setItem("editor", JSON.stringify(e.getOptions()))
}
function preview() {
	let x = ""
	if(settings.eruda)x = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/eruda/2.4.1/eruda.min.js\" onload=\"eruda.init()\"></script>"
	i.srcdoc = x + settings.preview.pre + e.getValue() + settings.preview.post 
}
function openSettings() {
	let s = {}
	let f = document.createElement("form")
	f.id = "set"
	f.innerHTML = "<h1>Settings</h1><small>Remove their values to see what the inputs are for. If you don't want to save what you have entered then refresh the page. For more editor related settings, enter ctrl+',' or cmd+',' or on mobile, use the ... button, open palette and select settings</small>"
	s.m = document.createElement("input") //language mode
	s.m.value = settings.mode
	s.m.placeholder = "language mode (html, javascript, etc.)"
	s.m.oninput = e => settings.mode = e.target.value.toLowerCase()
	f.appendChild(s.m)
	
	s.as = document.createElement("input") //autosave
	s.as.type = "number"
	s.as.placeholder = "autosave delay (seconds) (0 = no autosave)"
	s.as.value = settings.autosave
	s.as.oninput = e => settings.autosave = e.target.value
	f.appendChild(s.as)
	
	s.pr = document.createElement("textarea") //pre
	s.pr.value = settings.preview.pre
	s.pr.placeholder = "HTML code to add before the code entered in ace before it is shown in the preview (like \"<script>\")"
	s.pr.oninput = e => settings.preview.pre = e.target.value
	f.appendChild(s.pr)
	
	s.po = document.createElement("textarea") //post
	s.po.value = settings.preview.post
	s.po.placeholder = "HTML code to add after the code entered in ace before it is shown in the preview (like \"</script>\")"
	s.po.oninput = e => settings.preview.post = e.target.value
	f.appendChild(s.po)
	/*
	s.v = document.createElement("input") //layout
	s.l = document.createElement("span")
	s.v.checked = settings.horizmode
	s.v.type = "checkbox"
	s.l.innerText = "Use horizontal layout"
	s.v.oninput = e => settings.horizmode = e.target.checked
	s.l.style.position = "absolute"
	f.appendChild(s.l)
	f.appendChild(s.v)
	*/
	s.v = document.createElement("input") //layout
	s.l = document.createElement("label")
	s.v.checked = settings.horizmode
	s.v.type = "checkbox"
	s.l.innerText = "Use horizontal layout"
	s.v.oninput = e => settings.horizmode = e.target.checked
	f.appendChild(s.v)
	f.appendChild(s.l)
	
	f.appendChild(document.createElement("br"))
	
	s.v = document.createElement("input") //console
	s.l = document.createElement("label")
	s.v.checked = settings.eruda
	s.v.type = "checkbox"
	s.l.innerText = "Enable eruda console in preview"
	s.v.oninput = e => settings.eruda = e.target.checked
	f.appendChild(s.v)
	f.appendChild(s.l)

	f.appendChild(document.createElement("br"))

	s.v = document.createElement("input") //live preview
	s.l = document.createElement("label")
	s.v.checked = settings.live
	s.v.type = "checkbox"
	s.l.innerText = "Live preview"
	s.v.oninput = e => settings.live = e.target.checked
	f.appendChild(s.v)
	f.appendChild(s.l)
	
	s.t = document.createElement("input") //theme
	s.t.value = settings.font.family
	s.t.placeholder = "css font family name"
	s.t.oninput = e => settings.font.family = e.target.value
	f.appendChild(s.t)
	//---x---x---x---//
	s.s = document.createElement("button")
	s.s.innerText = "save and close"
	s.s.type = "submit"
	f.appendChild(s.s)
	f.onsubmit = (e) => {
		save()
		localStorage.setItem("settings", JSON.stringify(settings))
		location.reload()
	}
	document.body.appendChild(f)
	s = undefined;
}
var def =
	`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
</head>

<body>

</body>

</html>`
if (localStorage.getItem("code") !== null) {
	e.setValue(localStorage.getItem("code"))
} else {
	localStorage.setItem("code", def)
	e.setValue(localStorage.getItem("code"))
}
localStorage.setItem("code","")
e.setOptions({
	enableLiveAutocompletion: true,
	fontFamily: settings.font.family,
	enableSnippets: true
});
//save()
e.on("change", () => {
	if (settings.live) {
		preview()
	}
})
if (settings.autosave) {
	setTimeout(()=>setInterval(() => save(), settings.autosave * 1000), 1000)
}
if(settings.horizmode){
	document.getElementById("editor").style.height = "90vh"
	document.getElementById("editor").style.width = "49vw"
	i.style.height = "90vh"
	i.style.width = "49vw"
	i.style.margin = "0"
	i.style.marginLeft = "49vw"
}
e.setFontSize(Number(settings.font.size))
e.setOptions(JSON.parse(localStorage.getItem("editor")))

function full() {
	let x = ""
	if (settings.eruda) x = "<script src=\"https://cdn.jsdelivr.net/npm/eruda/eruda.js\" onload=\"eruda.init()\"></script>"
	let htm = x + settings.preview.pre + e.getValue() + settings.preview.post
	open("https://showhtm.vercel.app/?"+btoa(htm))
}
setTimeout(()=>{
	e.setOptions({
		enableLiveAutocompletion: true,
		fontFamily: settings.font.family,
		enableSnippets: true
	});
	localStorage.setItem("code",e.getValue())
},500)