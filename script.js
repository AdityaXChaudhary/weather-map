document.addEventListener("DOMContentLoaded", function () {
  const mapObject = document.getElementById("india-map");

  mapObject.addEventListener("load", function () {
    const svgDoc = mapObject.contentDocument;
    const states = svgDoc.querySelectorAll("path, g"); // some maps use <g> groups

    states.forEach((state) => {
      state.style.cursor = "pointer";

      state.addEventListener("mouseover", () => {
        const stateName = state.getAttribute("name") || state.getAttribute("id");
        state.classList.add("hovered");
        document.getElementById("region-name").innerText = stateName;
        document.getElementById("details").innerText = "Fetching data...";
      });

      state.addEventListener("mouseout", () => {
        state.classList.remove("hovered");
      });

      state.addEventListener("click", () => {
        //alert("You clicked on: " + (state.getAttribute("name") || state.getAttribute("id")));
      });
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const svgObject = document.getElementById("india-map");

  svgObject.addEventListener("load", () => {
    const svgDoc = svgObject.contentDocument;

    svgDoc.querySelectorAll(".state").forEach((state) => {
      state.addEventListener("mouseover", () => {
        console.log("Hovering:", state.id);
      });
      state.addEventListener("click", () => {
       // alert("You clicked on: " + state.id);
      });
    });
  });
});

const API_KEY = "1d530a3be4e35a18d9f7c92b7c7f1a85";

//Approx lat/lon for major states----->we can add more regions here to get info about weather
const stateCoordinates = {
  "Andhra Pradesh": { lat: 15.9129, lon: 79.7400 },
  "Arunachal Pradesh": { lat: 28.2180, lon: 94.7278 },
  "Assam": { lat: 26.2006, lon: 92.9376 },
  "Bihar": { lat: 25.0961, lon: 85.3131 },
  "Chhattisgarh": { lat: 21.2787, lon: 81.8661 },
  "Goa": { lat: 15.2993, lon: 74.1240 },
  "Gujarat": { lat: 22.2587, lon: 71.1924 },
  "Haryana": { lat: 29.0588, lon: 76.0856 },
  "Himachal Pradesh": { lat: 31.1048, lon: 77.1734 },
  "Jharkhand": { lat: 23.6102, lon: 85.2799 },
  "Karnataka": { lat: 15.3173, lon: 75.7139 },
  "Kerala": { lat: 10.8505, lon: 76.2711 },
  "Madhya Pradesh": { lat: 22.9734, lon: 78.6569 },
  "Maharashtra": { lat: 19.7515, lon: 75.7139 },
  "Manipur": { lat: 24.6637, lon: 93.9063 },
  "Meghalaya": { lat: 25.4670, lon: 91.3662 },
  "Mizoram": { lat: 23.1645, lon: 92.9376 },
  "Nagaland": { lat: 26.1584, lon: 94.5624 },
  "Odisha": { lat: 20.9517, lon: 85.0985 },
  "Punjab": { lat: 31.1471, lon: 75.3412 },
  "Rajasthan": { lat: 27.0238, lon: 74.2179 },
  "Sikkim": { lat: 27.5330, lon: 88.5122 },
  "Tamil Nadu": { lat: 11.1271, lon: 78.6569 },
  "Telangana": { lat: 18.1124, lon: 79.0193 },
  "Tripura": { lat: 23.9408, lon: 91.9882 },
  "Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
  "Uttarakhand": { lat: 30.0668, lon: 79.0193 },
  "West Bengal": { lat: 22.9868, lon: 87.8550 },
  "Jammu and Kashmir":{lat: 33.54,lon:74.54},
  "Ladakh":{lat: 34.22,lon:77.56},
  "Delhi":{lat:28.61,lon:77.20}
};

async function fetchWeather(stateName) {
  const coords = stateCoordinates[stateName];
  if (!coords) {
    document.getElementById("details").innerText = "No data available.";
    return;
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();

    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].description;
    const feelsLike = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;

    document.getElementById("details").innerHTML = `
      🌡 Temp: ${temp}°C<br>
      🌤 Feels Like: ${feelsLike}°C<br>
      ☔︎ Humidity: ${humidity}%<br>
      ☁ Condition: ${condition}

      
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("details").innerText = "Error fetching weather.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const svgObject = document.getElementById("india-map");

  svgObject.addEventListener("load", () => {
    const svgDoc = svgObject.contentDocument;

    svgDoc.querySelectorAll(".state").forEach((state) => {
      state.addEventListener("mouseover", () => {
        const stateName = state.getAttribute("id");
        document.getElementById("region-name").innerText = stateName;
        document.getElementById("details").innerText = "Loading...";
        fetchWeather(stateName);
      });
    });
  });
});


//my location------------------->
async function fetchMyLocationWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    document.getElementById("region-name").innerText = `Your Location`;
    document.getElementById("details").innerHTML = `
      📍 ${data.name}<br>
      🌡 Temp: ${data.main.temp}°C<br>
      ☁ ${data.weather[0].description}
    `;
  } catch (err) {
    document.getElementById("details").innerText = "Error fetching weather.";
  }
}

//When clicking the button asking for my location
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("my-location-btn").addEventListener("click", () => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          fetchMyLocationWeather(lat, lon);
          //alert(` Location detected: Lat ${lat}, Lon ${lon}`);
        },
        (err) => {
          
          alert("❗Location access denied."+" \n"+ "Please allow location.");
        }
      );
    } else {
      alert("Your browser does not support Geolocation.");
    }
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const mapObject = document.querySelector("#india-map");

  mapObject.addEventListener("load", () => {
    const svgDoc = mapObject.contentDocument;
    const states = svgDoc.querySelectorAll(".state"); 
    const tooltip = document.getElementById("tooltip");
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    

    states.forEach(state => {
      state.style.cursor = "pointer";

      const stateName = state.getAttribute("title") || state.id || "Unknown";

if (isMobile) {
  state.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent bubbling to document click

    const stateName = state.getAttribute("title") || state.id || "Unknown";
    const rect = e.target.getBoundingClientRect();

    tooltip.textContent = stateName;
    tooltip.style.left = `${rect.left + window.scrollX - 10}px`;
    tooltip.style.top = `${rect.top + window.scrollY + 130}px`;
    tooltip.style.display = "block";
  });

  function hideTooltip() {
  tooltip.style.display = "none";
}

// Attach tap outside hide to main document
document.addEventListener("click", hideTooltip);

// Also attach inside the SVG document
svgDoc.addEventListener("click", (e) => {
  // If clicked *outside* any state
  if (!e.target.classList.contains("state")) {
    tooltip.style.display = "none";
  }



        });
      } else {
        // ------> Desktop: Hover and follow 
        state.addEventListener("mouseenter", () => {
          tooltip.textContent = stateName;
          tooltip.style.display = "block";
        });

        state.addEventListener("mousemove", (e) => {
          let x = e.clientX + 108;
          let y = e.clientY + 97;
          const tooltipRect = tooltip.getBoundingClientRect();

          // Adjust if tooltip goes outside window
          if (x + tooltipRect.width > window.innerWidth) {
            x = e.clientX - tooltipRect.width - 10;
          }
          if (y + tooltipRect.height > window.innerHeight) {
            y = e.clientY - tooltipRect.height +126;
          }

          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
        });

        state.addEventListener("mouseleave", () => {
          tooltip.style.display = "none";
        });
      }
    });
  });
});

// Typewriter effect
const text = "Get real-time weather and AQI details by hovering or tapping on the states";
const target = document.getElementById("typewriter");
let index = 0;

function typeWriter() {
  if (index < text.length) {
    target.textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, 20); // typing speed
  }
}
target.textContent="";
// Start typewriter after DOM loads
document.addEventListener("DOMContentLoaded", typeWriter);




document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").slice(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 70; // 70 = navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  });
});