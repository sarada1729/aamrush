import React from "react";
import { MapPin, ShoppingCart } from "lucide-react";

export default function GujaratMangoDeliverySite() {
  const [step, setStep] = React.useState("location");
  const [coords, setCoords] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [address, setAddress] = React.useState("");

  const mangoes = [
    { name: "Kesar Mango", price: "₹699", desc: "Sweet and aromatic." },
    { name: "Alphonso Mango", price: "₹899", desc: "Premium taste." },
    { name: "Rajapuri Mango", price: "₹549", desc: "Juicy everyday mango." },
  ];

  const saveLocationToBackend = async (payload) => {
    const res = await fetch("http://127.0.0.1:5050/save-location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to save location");
    }

    return res.json();
  };

  const fetchAddressAndSave = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=1a2d063c76f540a6bf4ebef6a1c99eff`
      );

      if (!res.ok) {
        throw new Error(`OpenCage failed with status ${res.status}`);
      }

      const data = await res.json();

      const formatted =
        data?.results && data.results.length > 0
          ? data.results[0].formatted
          : "Address not found";

      setAddress(formatted);

      await saveLocationToBackend({
        latitude: lat,
        longitude: lon,
        address: formatted,
        timestamp: new Date().toISOString(),
      });

      setStep("shop");
      setStatusMessage("Location saved successfully");
    } catch (err) {
      console.error(err);
      setStatusMessage(err.message || "Error detecting or saving location");
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage("Location not supported on this browser");
      return;
    }

    setStatusMessage("Requesting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setCoords({ latitude: lat, longitude: lon });
        await fetchAddressAndSave(lat, lon);
      },
      (error) => {
        console.error(error);
        setStatusMessage("Permission denied or location unavailable");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (step === "location") {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#ffedd5_45%,_#fde68a_100%)] px-5 py-8 text-slate-900">
        <div className="mx-auto flex min-h-[90vh] max-w-5xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-orange-100 md:grid-cols-2">
            <div className="flex flex-col justify-between bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-300 p-8 text-white md:p-10">
              <div>
                <div className="mb-5 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-bold tracking-[0.2em] backdrop-blur-sm">
                  AAMRUSH
                </div>
                <h1 className="mb-4 text-4xl font-black leading-tight md:text-5xl">
                  Mangoes worth rushing for.
                </h1>
                <p className="max-w-md text-base leading-7 text-white/90">
                  Fresh mango delivery with a smooth location-first experience.
                </p>
              </div>

              <div className="mt-8 space-y-3 text-sm text-white/90">
                <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
                  Fresh seasonal mangoes
                </div>
                <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
                  Fast doorstep delivery
                </div>
                <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
                  Powered by AamRush
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center bg-white p-8 md:p-10">
              <div className="w-full max-w-md text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <MapPin size={30} />
                </div>

                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
                  Welcome to AamRush
                </p>

                <h2 className="mb-3 text-3xl font-black text-slate-900">
                  Enable your location
                </h2>

                <p className="mb-6 text-slate-600">
                  We’ll detect your address and save it for delivery.
                </p>

                <button
                  onClick={requestLocation}
                  className="w-full rounded-2xl bg-slate-900 px-5 py-4 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Allow Location Access
                </button>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-100">
                  {statusMessage || "Your location will be saved after permission."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-orange-600">AamRush</h1>
            <p className="text-sm text-slate-500">Fresh mangoes delivered to your doorstep</p>
          </div>

          <button className="rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-lg">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} />
              <span>Cart</span>
            </div>
          </button>
        </div>

        {address && (
          <div className="mb-6 rounded-2xl bg-green-100 p-4 text-sm font-medium text-green-900">
            Delivering to: {address}
          </div>
        )}

        {coords && (
          <div className="mb-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
            Coordinates: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
          </div>
        )}

        <h2 className="mb-4 text-3xl font-black">Shop mangoes</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {mangoes.map((m) => (
            <div
              key={m.name}
              className="overflow-hidden rounded-[28px] bg-white p-4 shadow-lg ring-1 ring-orange-100"
            >
              <div className="mb-3 h-36 rounded-2xl bg-gradient-to-br from-yellow-200 via-orange-200 to-orange-400" />
              <h3 className="text-xl font-bold">{m.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{m.desc}</p>
              <p className="mt-3 text-lg font-black">{m.price}</p>
              <button className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}