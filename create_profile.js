$(document).ready(function () {
    var cached_loading_time = Array(150).fill(0);
    var not_cached_loading_time = Array(150).fill(0);
    var num_not_cached = 0;
    var num_cached = 0;
    var min_cache_miss = 1000;

    var boundary = 0;
    var platforms = {
        "Learnweb": "https://www.uni-muenster.de/LearnWeb/learnweb2/pluginfile.php/1/local_marketing/slidesfilearea/5/ratingallocate.png"
    };

    var ctx = document.getElementById('chart').getContext('2d');
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from(Array(150).keys()),
            datasets: []
        },

        // Configuration options go here
        options: {}
    });

    $("#btnTimeCache").click(function () {
        var cached_images = ["https://images.pexels.com/photos/288101/pexels-photo-288101.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "https://images.pexels.com/photos/831890/pexels-photo-831890.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.pexels.com/photos/1635905/pexels-photo-1635905.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.pexels.com/photos/1662242/pexels-photo-1662242.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "https://images.pexels.com/photos/3694341/pexels-photo-3694341.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.pexels.com/photos/755858/pexels-photo-755858.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"];

        for (i = 0; i < cached_images.length; i++) {
            var startTime = new Date().getTime();
            var img = $("#imgL" + (i + 1));
            $(img).data('starttime', startTime);
            $(img).on('load', function () {
                var loadtime = new Date().getTime() - $(this).data('starttime');
                cached_loading_time[loadtime] += 1;
                num_cached += 1
                if (cached_images.length === num_cached) {
                    myBarChart.data.datasets.push({
                        label: 'Cache Hits',
                        backgroundColor: '#6cff84',
                        data: cached_loading_time
                    });
                    myBarChart.update();
                }
            });
            $(img).attr('src', cached_images[i]);
        }
    });

    $("#btnTimeNotCached").click(function () {
        var not_cached_images = ["https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "https://images.pexels.com/photos/793765/pexels-photo-793765.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "https://images.pexels.com/photos/1346345/pexels-photo-1346345.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "https://images.pexels.com/photos/3750709/pexels-photo-3750709.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "https://images.pexels.com/photos/343870/pexels-photo-343870.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"];

        for (i = 0; i < not_cached_images.length; i++) {
            var startTime = new Date().getTime();
            var img = $("#img" + (i + 1));
            $(img).data('starttime', startTime);
            $(img).on('load', function () {
                var loadtime = new Date().getTime() - $(this).data('starttime');
                not_cached_loading_time[loadtime] += 1;
                num_not_cached += 1;

                if (loadtime < min_cache_miss) {
                    min_cache_miss = loadtime;
                }

                if (not_cached_images.length === num_not_cached) {
                    boundary = min_cache_miss - 10;
                    myBarChart.data.datasets.push({
                        label: 'Cache Misses',
                        backgroundColor: '#ff6c6c',
                        data: not_cached_loading_time
                    });
                    let boundary_chart = Array(150).fill(0);
                    boundary_chart[boundary] = 2;
                    myBarChart.data.datasets.push({
                        label: 'Decision Boundary',
                        backgroundColor: '#0046ff',
                        data: boundary_chart
                    });
                    myBarChart.update();
                }
            });
            $(img).attr('src', not_cached_images[i]);
        }
    });

    $("#btnCreateProfile").click(function () {
        let key;
        for (key in platforms) {
            var startTime = new Date().getTime();
            var img = new Image();
            img.id = key;
            img.data = startTime;
            img.onload = function () {
                var loadtime = new Date().getTime() - this.data;
                console.log(loadtime);
                if (loadtime < boundary) {
                    $("#" + this.id.toLowerCase() + " span").text("Besucht (" + loadtime + ")");
                } else {
                    $("#" + this.id.toLowerCase() + " span").text("Nicht Besucht (" + loadtime + ")");
                }
            };
            img.src = platforms[key];
        }
    });
});
