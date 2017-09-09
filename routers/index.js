'use strict';
window.onload = ()=> {
	var form = document.getElementById('form');
	var render = document.getElementById('respones');

form.addEventListener('submit', (e) =>{
	e.preventDefault();
	var clName = document.getElementById('clientName');
	console.log(clName.value);
	request(clName.value);
	e.target.reset()
});


	function request(name) {
		 	fetch('https://api.github.com/users/'+name).then( res => {
			console.log(res);
			if(!res.ok) {
				console.log(res.status)
				rend(res.status)
				return res.status
			}
			var a = res.json().then( e => {
				parser(e)

			});
			return res.body
	  }).catch((e) =>{
	  	console.log('Eror' + e);
	  });
	}

	function parser(obj){
		var template = document.getElementById('tamplate').innerText;
		console.log(obj);
		var outTemplate = template.replace("%Name%", obj.login)
			.replace("%src%", obj.avatar_url);
		 document.getElementById('respones').innerHTML = outTemplate;
	}
	function rend(error){
		var er = document.getElementById('error').innerText;
		var outEr =er.replace("%Error%", 'Error '+ error);
	 	 document.getElementById('respones').innerHTML = outEr;
	}
}
