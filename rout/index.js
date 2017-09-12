'use strict';

const NO_SORTING = () => 0;
const BOOL_SORTING = (a,b) => {
	if(a ==true ){
		return -1;
	} else if (b==true ){
		return 1;
	} else {
		return 0;
	}
};
let filters = [];
let arrRepofilters = [];
var items=[];
var fullItems = [];

window.onload = ()=> {
	var form = document.getElementById('form');

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		var clName = document.getElementById('clientName');

		request(clName.value);
		e.target.reset()
	});

	function request(name) {
		 	fetch('https://api.github.com/users/'+name+'/repos').then( res => {
			if(!res.ok) {
				rend(res.status)
				return res.status
			}
			var a = res.json().then( e => {
				filters = [];
				items = e;
				fullItems = e;
				render()

			});
			return res.body
	  }).catch((e) =>{
	  	console.log('Eror' + e);
	  });
	}
}
function render() {
	var template = document.getElementById('tamplate').innerText;
	var repoTemp = document.getElementById('repo').innerText;
	var outTemplate = template.replace("%Name%", items[0].owner.login)
		.replace("%src%", items[0].owner.avatar_url);
	outTemplate += items.reduce(function(result, repo){
    return result+repoTemp.replace("%repo%", repo.name)
      .replace("%desc%", repo.description? repo.description : "")
      .replace("%fork%", repo.fork? "fork":"no")
      .replace("%stars%", repo.stargazers_count > 0 ?
      		'<i class="fa fa-star"></i>'
      		+ repo.stargazers_count : ""
      	)
      .replace("%dateUpdated%", repo.updated_at)
      .replace("%lng%", repo.language? repo.language:"")
    },'<article><table id="repos"> <thead> <tr> <th column="name">Repo name <i class="fa fa-sort"></i></th> <th column="description">description<i class="fa fa-sort"></i></th> <th column="fork">fork<i class="fa fa-sort"></i></th>'
    	+ ' <th column="stargazers_count">stars count<i class="fa fa-sort"></i></th> <th column="updated_at">updated date<i class="fa fa-sort"></i></th> <th column="language">language<i class="fa fa-sort"></i></th> </tr> </thead> <tbody>')
	outTemplate += "</tbody></table></article>"
	document.getElementById('respones').innerHTML = outTemplate;
	var  repos =	document.getElementById('repos')
	repos.addEventListener('click', onClick);
	filters.forEach((elem) =>{
		if (elem[1]=='acs'){
			document.querySelector("th[column="+elem[0] +"]").children[0].classList.remove('fa-sort-asc');
			document.querySelector("th[column="+elem[0] +"]").children[0].classList.add('fa-sort-desc');
		} else if (elem[1]=='desc'){
			document.querySelector("th[column="+elem[0] +"]").children[0].classList.remove('fa-sort-desc');
			document.querySelector("th[column="+elem[0] +"]").children[0].classList.add('fa-sort-asc');
		} else {
			document.querySelector("th[column="+elem[0] +"]").children[0].classList.remove('fa-sort');
			document.querySelector("th[column="+elem[0] +"]").children[0].classList.add('fa-sort-asc');
		}
	})
	var repoFilters = document.getElementById('filters');
	repoFilters.addEventListener('click', onClickFilters);
}


function rend(error){
	var er = document.getElementById('error').innerText;
	var outEr =er.replace("%Error%", 'Error '+ error);
 	 document.getElementById('respones').innerHTML = outEr;
}
function getStringSorting(column){
	if (/.*\/_at$/.test(column)) {
		return (a, b) => Date.parse(a) - Date.parse(b);
	} else {
		return (a, b) => (a ||'').localeCompare(b || '');
	}
}


function getTypeSorting(column, value) {
  switch(typeof value) {
  	case 'number': return (a, b) => a - b;
    case 'boolean': return BOOL_SORTING;
    default: return getStringSorting(column);
  }
}

function resort() {
  items.sort(function(a, b) {
    for(let i = 0; i < filters.length; i++) {
      let [key, direction, sorting] = filters[i];
      let rank = sorting(a[key], b[key]);
      if(rank !== 0) {
        return (direction === 'acs' ? 1 : -1) * rank;
      }
    }
    return 0;
  });
  render();
}
function repoFilter() {
	var repos = fullItems;
	arrRepofilters.forEach(e=> {
		switch(e){
			case 'fork' : return repos = repos.filter( item=> item.fork);
			case 'issues': return repos.filter(item=> item.open_issues_count > 0);
			case 'topics': return repos;
			case 'soursces': return repos;
			default : return repos;
		}
	})
	items = repos;
	render();
}
function check(name){
	item.name
}

function toggleFilter(filter) {
  filter[1] = (filter[1] === 'acs') ? 'desc' : 'acs';
  return filter;
}

function onClick(e) {
  let column = e.target.getAttribute('column');
  let i = filters.findIndex(c => c[0] === column);

  if(i === -1) {
    let firstItem = items[0];
    let sorting = firstItem ? getTypeSorting(column, firstItem[column]) : NO_SORTING;
    filters.unshift([column, 'acs', sorting]);
  } else {
    let filter = filters[i];
    filters.splice(i, 1);
    filters.unshift(toggleFilter(filter));
  }
  resort();
}

function onClickFilters(e){
	e.target.parentElement.querySelectorAll('input').forEach(name=> {
		if(name.checked){
			arrRepofilters.push(name.id)
		}
	})
	repoFilter();
	arrRepofilters=[];
}



