'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var NO_SORTING = function NO_SORTING() {
	return 0;
};
var BOOL_SORTING = function BOOL_SORTING(a, b) {
	if (a == true) {
		return -1;
	} else if (b == true) {
		return 1;
	} else {
		return 0;
	}
};
var filters = [];
var arrRepofilters = [];
var items = [];
var fullItems = [];

window.onload = function () {
	var form = document.getElementById('form');

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		var clName = document.getElementById('clientName');

		request(clName.value);
		e.target.reset();
	});

	function request(name) {
		fetch('https://api.github.com/users/' + name + '/repos').then(function (res) {
			if (!res.ok) {
				rend(res.status);
				return res.status;
			}
			var a = res.json().then(function (e) {
				filters = [];
				items = e;
				fullItems = e;
				render();
			});
			return res.body;
		}).catch(function (e) {
			console.log('Eror' + e);
		});
	}
};
function render() {
	var template = document.getElementById('tamplate').innerText;
	var repoTemp = document.getElementById('repo').innerText;
	var outTemplate = template.replace("%Name%", items[0].owner.login).replace("%src%", items[0].owner.avatar_url);
	outTemplate += items.reduce(function (result, repo) {
		return result + repoTemp.replace("%repo%", repo.name).replace("%desc%", repo.description ? repo.description : "").replace("%fork%", repo.fork ? "fork" : "no").replace("%stars%", repo.stargazers_count > 0 ? '<i class="fa fa-star"></i>' + repo.stargazers_count : "").replace("%dateUpdated%", repo.updated_at).replace("%lng%", repo.language ? repo.language : "");
	}, '<article><table id="repos"> <thead> <tr> <th column="name">Repo name <i class="fa fa-sort"></i></th> <th column="description">description<i class="fa fa-sort"></i></th> <th column="fork">fork<i class="fa fa-sort"></i></th>' + ' <th column="stargazers_count">stars count<i class="fa fa-sort"></i></th> <th column="updated_at">updated date<i class="fa fa-sort"></i></th> <th column="language">language<i class="fa fa-sort"></i></th> </tr> </thead> <tbody>');
	outTemplate += "</tbody></table></article>";
	document.getElementById('respones').innerHTML = outTemplate;
	var repos = document.getElementById('repos');
	repos.addEventListener('click', onClick);
	filters.forEach(function (elem) {
		if (elem[1] == 'acs') {
			document.querySelector("th[column=" + elem[0] + "]").children[0].classList.remove('fa-sort-asc');
			document.querySelector("th[column=" + elem[0] + "]").children[0].classList.add('fa-sort-desc');
		} else if (elem[1] == 'desc') {
			document.querySelector("th[column=" + elem[0] + "]").children[0].classList.remove('fa-sort-desc');
			document.querySelector("th[column=" + elem[0] + "]").children[0].classList.add('fa-sort-asc');
		} else {
			document.querySelector("th[column=" + elem[0] + "]").children[0].classList.remove('fa-sort');
			document.querySelector("th[column=" + elem[0] + "]").children[0].classList.add('fa-sort-asc');
		}
	});
	var repoFilters = document.getElementById('filters');
	repoFilters.addEventListener('click', onClickFilters);
}

function rend(error) {
	var er = document.getElementById('error').innerText;
	var outEr = er.replace("%Error%", 'Error ' + error);
	document.getElementById('respones').innerHTML = outEr;
}
function getStringSorting(column) {
	if (/.*\/_at$/.test(column)) {
		return function (a, b) {
			return Date.parse(a) - Date.parse(b);
		};
	} else {
		return function (a, b) {
			return (a || '').localeCompare(b || '');
		};
	}
}

function getTypeSorting(column, value) {
	switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
		case 'number':
			return function (a, b) {
				return a - b;
			};
		case 'boolean':
			return BOOL_SORTING;
		default:
			return getStringSorting(column);
	}
}

function resort() {
	items.sort(function (a, b) {
		for (var i = 0; i < filters.length; i++) {
			var _filters$i = _slicedToArray(filters[i], 3),
			    key = _filters$i[0],
			    direction = _filters$i[1],
			    sorting = _filters$i[2];

			var rank = sorting(a[key], b[key]);
			if (rank !== 0) {
				return (direction === 'acs' ? 1 : -1) * rank;
			}
		}
		return 0;
	});
	render();
}
function repoFilter() {
	var repos = fullItems;
	arrRepofilters.forEach(function (e) {
		switch (e) {
			case 'fork':
				return repos = repos.filter(function (item) {
					return item.fork;
				});
			case 'issues':
				return repos.filter(function (item) {
					return item.open_issues_count > 0;
				});
			case 'topics':
				return repos;
			case 'soursces':
				return repos;
			default:
				return repos;
		}
	});
	items = repos;
	render();
}
function check(name) {
	item.name;
}

function toggleFilter(filter) {
	filter[1] = filter[1] === 'acs' ? 'desc' : 'acs';
	return filter;
}

function onClick(e) {
	var column = e.target.getAttribute('column');
	var i = filters.findIndex(function (c) {
		return c[0] === column;
	});

	if (i === -1) {
		var firstItem = items[0];
		var sorting = firstItem ? getTypeSorting(column, firstItem[column]) : NO_SORTING;
		filters.unshift([column, 'acs', sorting]);
	} else {
		var filter = filters[i];
		filters.splice(i, 1);
		filters.unshift(toggleFilter(filter));
	}
	resort();
}

function onClickFilters(e) {
	e.target.parentElement.querySelectorAll('input').forEach(function (name) {
		if (name.checked) {
			arrRepofilters.push(name.id);
		}
	});
	// if (e.target.checked){
	// 	arrRepofilters.push(e.target.id);
	// } else {
	// 	let ind = arrRepofilters.findIndex(c => c ===e.target.id)
	// 	if(ind===-1){

	// 	} else {
	// 		let filt = arrRepofilters[ind];
	//     arrRepofilters.splice(ind, 1);
	// 	}
	// }
	repoFilter();
	arrRepofilters = [];
}