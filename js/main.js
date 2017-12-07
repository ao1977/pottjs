(function (window, $) {

    var sort = function (sortBy) {
        var container = document.querySelector('#container');
        var entries = container.querySelectorAll(".entry");
		var srt = [];
		entries.forEach(function(oElm) {
			srt.push(oElm);
		});

        srt.sort(function(a,b){
            var contentA = parseInt( a.getAttribute('data-'+sortBy) || 0);
            var contentB = parseInt( b.getAttribute('data-'+sortBy) || 0);
            return (contentA < contentB) ? -1 : 1;
        }).forEach(function (oElm) {
            container.removeChild(oElm);
			container.appendChild(oElm);
        });
    };

    var buildList = function (entries) {
        var container = document.querySelector('#container');

		while(container.hasChildNodes()) {
			container.removeChild(container.firstChild);
		}

		var iFiltered = 0;

        entries.filter(function(t) {
			switch(true) {
				case t.data.thumbnail == '':
				case t.data.thumbnail == 'self':
				case t.data.over_18:
				case t.data.stickied:
					++iFiltered;
					return false;
			}
			return true;
		}).forEach(function (t) {
            var entry = document.createElement('a');
            entry.classList.add('entry');
            entry.href = t.data.url;
            entry.target = "_blank";
            entry.setAttribute('data-score', t.data.score);
            entry.setAttribute('data-ups', t.data.ups);
            entry.setAttribute('data-created', t.data.created);

            var figure = document.createElement('figure');
            figure.href = t.data.url;
            figure.target = "_blank";

            var thumbnail = document.createElement('img');
            thumbnail.src = t.data.thumbnail;
            thumbnail.alt = t.data.title;
            figure.appendChild(thumbnail);

            var title = document.createElement('figcaption');
            title.innerHTML = t.data.title;
            figure.appendChild(title);

            container.appendChild(entry).appendChild(figure);
        });

		if(iFiltered) {
			var sText = String(iFiltered)+' '+atob(1 == iFiltered ? 'RWludHJhZw==' : 'RWludHLkZ2U=')+' '+atob('bmljaHQgYW5nZXplaWd0IHdlZ2VuIFNjaHdlbnNl');
			var node = document.createElement('h1');
			node.classList.add('alert');
			node.appendChild(document.createTextNode(sText));
			container.insertBefore(node, container.firstChild);
		}

    };

    var getJSON = function(sub, cat, limit) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener('load', function(res) {
			buildList(res.target.response.data.children || []);
			sort('ups');
		});
		httpRequest.addEventListener('error', function(res) {
			alert(atob("QnJ1ZGksIGRhIGlzdCB3YXMgc2NoaWVmIGdlbGV1ZnQu"));
		});
        httpRequest.responseType = 'json';
        httpRequest.open('GET', 'https://www.reddit.com/r/'+encodeURIComponent(sub)+'/'+encodeURIComponent(cat)+'.json?limit='+encodeURIComponent(limit)+'&g=GLOBAL', true);
        httpRequest.send(null);
    };

    var init = function() {
        var filter = document.querySelector('#filter');
        filter.addEventListener('submit', function(e)  {
            var formData = new FormData(filter),
                subreddit = formData.get('subreddit'),
                category = formData.get('category');
                limit = formData.get('limit');

            getJSON(subreddit, category, limit);
            e.preventDefault();
        });

		document.querySelectorAll('input[name="sort"]').forEach(function(oElm) {
			oElm.addEventListener('change', function() {
				sort(this.value);
			});
		});

        getJSON('memes', 'hot', '15');
    };

    document.addEventListener('DOMContentLoaded', init);

})(window);
