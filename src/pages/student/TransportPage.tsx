import { Bus, MapPin, Phone, Clock3, Navigation, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getTransportInfo } from "../../services/mock/transport";

export default function TransportPage() {
  const { selectedChild } = useAuth();
  const info = selectedChild ? getTransportInfo(selectedChild.id) : null;

  if (!info) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <section>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Transport</h1>
          <p className="mt-1 text-sm text-zinc-500">School bus information and route details.</p>
        </section>
        <div className="mt-8 rounded-xl border border-dashed border-zinc-200 p-12 text-center">
          <Bus size={36} className="mx-auto text-zinc-300" strokeWidth={1.5} />
          <p className="mt-3 text-sm font-medium text-zinc-600">No transport assigned</p>
          <p className="mt-1 text-xs text-zinc-400">This student has not been assigned to a school bus route.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Heading */}
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Transport</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your assigned school bus route and pickup details.
        </p>
      </section>

      {/* Bus Banner */}
      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <Bus size={26} className="text-amber-600" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Assigned Bus</p>
              <p className="mt-1 text-xl font-bold text-zinc-900">{info.busNumber}</p>
              <p className="mt-0.5 text-sm text-zinc-500">{info.routeName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={15} />
            Transport Active
          </div>
        </div>
        <div className="border-t border-zinc-100 px-5 py-3">
          <p className="text-xs text-zinc-500">{info.routeDescription}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Pickup & Drop */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-base font-semibold text-zinc-900">My Stop Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <Navigation size={17} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-400">Pickup Stop</p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-900">{info.pickupStop}</p>
                <p className="mt-0.5 text-xs text-zinc-500 flex items-center gap-1">
                  <Clock3 size={12} /> {info.pickupTime}
                </p>
              </div>
            </div>
            <div className="ml-4 border-l-2 border-dashed border-zinc-200 pl-4 py-1">
              <p className="text-xs text-zinc-400">School route</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <MapPin size={17} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-400">Drop Stop</p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-900">{info.dropStop}</p>
                <p className="mt-0.5 text-xs text-zinc-500 flex items-center gap-1">
                  <Clock3 size={12} /> {info.dropTime} (approx.)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Driver & Attendant */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-base font-semibold text-zinc-900">Bus Staff</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600">
                {info.driverName.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900">{info.driverName}</p>
                <p className="text-xs text-zinc-500">Bus Driver</p>
              </div>
              <a
                href={`tel:${info.driverPhone}`}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                <Phone size={13} />
                Call
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600">
                {info.attendantName.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900">{info.attendantName}</p>
                <p className="text-xs text-zinc-500">Bus Attendant</p>
              </div>
            </div>
            <div className="border-t border-zinc-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Vehicle Model</span>
                <span className="font-medium text-zinc-900">{info.vehicleModel}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-zinc-500">Capacity</span>
                <span className="font-medium text-zinc-900">{info.vehicleCapacity} seats</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Route Stops */}
      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-900">Route Stops</h2>
          <p className="mt-1 text-sm text-zinc-500">All stops on {info.routeName} (morning pickup order)</p>
        </div>
        <div className="divide-y divide-zinc-100">
          {info.stops.map((stop) => (
            <div
              key={stop.order}
              className={`flex items-center gap-4 px-5 py-3.5 ${stop.isStudentStop ? "bg-amber-50/60" : ""}`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${stop.isStudentStop ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                {stop.order}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${stop.isStudentStop ? "text-amber-800" : "text-zinc-900"}`}>
                  {stop.name}
                  {stop.isStudentStop && (
                    <span className="ml-2 rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">Your Stop</span>
                  )}
                </p>
              </div>
              <span className="text-xs font-medium text-zinc-500">{stop.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <p className="text-center text-xs text-zinc-400">
        Live GPS tracking will be available once your school enables the GPS system.
      </p>
    </div>
  );
}
