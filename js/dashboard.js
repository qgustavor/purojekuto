(function () {
  var container = document.getElementById('container-row');
  var keys = {
    assistido: 'Assistido',
    animes: 'Animes',
    nome: 'Nome',
    data: 'Data',
    episodio: 'Episódio',
    episodios: 'Episódios',
    duracao: 'Duração'
  };
  
  Tabletop.init({
    key: '1j_6G6_4EoPzSFvmJ4dbPGqRJfivsdKcPEESLeNKnCEg',
    callback: onLoaded
  });
  
  function onLoaded (sheets) {
    document.getElementById('loading-message').style.display = 'none';
    
    var assistido = sheets[keys.assistido].elements.sort(function (a, b) {
      return a[keys.data] === b[keys.data] ? 0 : +(a[keys.data] > b[keys.data]) || -1;
    });
    
    var animes = sheets[keys.animes].elements.reduce(function (acc, element) {
      acc[element[keys.nome]] = element;
      return acc;
    }, {});
    
    var finishedAnime = Object.keys(assistido.reduce(function (finished, e) {
      var data = animes[e[keys.nome]];
      if (data && +data[keys.episodios] === +e[keys.episodio]) {
        finished[e[keys.nome]] = true;
      }
      return finished;
    }, {}));
    
    var names = assistido.map(function (e) {
      return e[keys.nome];
    });

    var uniqueNames = names.filter(function (e, i) {
      return i === names.indexOf(e);
    });
    
    var lastEpisodeData = {};
    var watchedEpisodeCount = 0;
    var days = assistido.reduce(function (acc, element) {
      var animeName = element[keys.nome];
      var animeData = animes[animeName];
      var duration = animeData ? animeData[keys.duracao] : 24;
      var watchedEpisodes = +element[keys.episodio] - (lastEpisodeData[animeName] || 0);
      
      if (watchedEpisodes === 0) {
        // rewatched?
        watchedEpisodes = 1;
      }
      
      if (watchedEpisodes < 0) {
        watchedEpisodes = +element[keys.episodio];
      }
      
      var watchedTime = watchedEpisodes * duration;
      
      watchedEpisodeCount += watchedEpisodes;
      lastEpisodeData[animeName] = +element[keys.episodio];
      
      return acc += watchedTime;
    }, 0) / 60 / 24;
    
    var watchingCount = uniqueNames.length - finishedAnime.length;
    
    var gaugeStats = [{
      title: 'Finished anime',
      label: 'anime',
      value: finishedAnime.length,
      max: Math.floor(finishedAnime.length / 100 + 1) * 100
    }, {
      title: 'Watched episodes',
      label: 'episodes',
      value: watchedEpisodeCount,
      max: Math.floor(watchedEpisodeCount / 1000 + 1) * 1000
    }, {
      title: 'Watched days',
      label: 'days',
      value: days,
      max: Math.floor(days / 30 + 1) * 30
    }, {
      title: 'Non-finished anime',
      label: 'anime',
      value: watchingCount,
      max: Math.floor(watchingCount / 10 + 1) * 10
    }];
    
    gaugeStats.forEach(renderGaugeStat);
    
    var element = document.createElement('div');
    element.className = 'col-xs-12 text-center';
    element.innerHTML = 'More stats coming soon...';
    container.appendChild(element);
  }
    
  function renderGaugeStat(stat) {
    element = document.createElement('div');
    element.className = 'col-xs-6 col-md-3';
    element.innerHTML = '<div class="chart-wrapper"><div class="chart-title">' + stat.title + '</div><div class="chart-stage">' +
    '<div class="chart-holder"></div></div></div>';
    container.appendChild(element);
    
    var gauge = new JustGage({
      parentNode: element.querySelector('.chart-holder'),
      label: stat.label,
      value: stat.value,
      max: stat.max
    });
  }
}());