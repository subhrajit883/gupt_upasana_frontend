import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    ImagePlus,
    LockKeyhole,
    Plus,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Trash2,
} from "lucide-react";
import { serviceBookingUrl, serviceUrl } from "../config/config";
import { useAuth } from "../context/AuthContext";
import { useRazorpay } from "../hooks/useRazorpay";
import fallbackImg from "../assets/fallback.jpeg";

const MAX_IMG_BYTES = 200 * 1024;
const MAX_PEOPLE_PER_BOOKING = 10;
const fieldClass = "w-full rounded-xl border border-[#e7c66b]/40 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#8B0000] focus:ring-4 focus:ring-[#8B0000]/10";
const labelClass = "mb-2 block text-xs font-semibold text-gray-700";
const formatCurrency = (amount, currency = "INR") => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
}).format(Number(amount) || 0);
const frequencyNames = {
    weekly: "Weekly",
    monthly: "Monthly",
    half_yearly: "Half-yearly",
    yearly: "Yearly",
};
const makePerson = () => ({ id: `${Date.now()}-${Math.random()}`, name: "", relation: "", photo: null });

const PhotoInput = ({ label, file, onChange, required = false }) => (
    <label className="block">
        <span className={labelClass}>{label}{required ? " *" : ""}</span>
        <span className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#dfd5bd] bg-white px-3 py-2.5 text-sm text-gray-600 hover:border-[#98701b]">
            <ImagePlus size={17} className="shrink-0 text-[#98701b]" />
            <span className="min-w-0 flex-1 truncate">{file?.name || "Choose photo (max 200KB)"}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onChange} className="sr-only" />
        </span>
    </label>
);

const ServiceBookingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, user, authHeader } = useAuth();
    const { openCheckout } = useRazorpay();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [selectedPackageId, setSelectedPackageId] = useState("");
    const [selectedAmountId, setSelectedAmountId] = useState("");
    const [devoteeType, setDevoteeType] = useState("individual");
    const [devoteeName, setDevoteeName] = useState("");
    const [devoteeCompanyName, setDevoteeCompanyName] = useState("");
    const [devoteeDesignation, setDevoteeDesignation] = useState("");
    const [devoteePhoto, setDevoteePhoto] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [traditionalIntention, setTraditionalIntention] = useState("");
    const [gotra, setGotra] = useState("");
    const [sankalp, setSankalp] = useState("");
    const [preferredDate, setPreferredDate] = useState("");
    const [preferredLocation, setPreferredLocation] = useState("");
    const [formError, setFormError] = useState("");
    const [paying, setPaying] = useState(false);
    const [completedBooking, setCompletedBooking] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const fetchPackages = async () => {
            try {
                const response = await axios.get(serviceUrl.packages);
                if (!response.data?.success) throw new Error("Unable to load service packages.");
                if (!cancelled) {
                    const available = (response.data.packages || []).filter((item) => item.active && item.status === "published");
                    setPackages(available);
                    setSelectedPackageId(available[0]?._id || "");
                    setSelectedAmountId(available[0]?.serviceAmounts?.[0]?._id || "");
                }
            } catch (err) {
                if (!cancelled) setLoadError(err.response?.data?.message || err.message || "Could not load services.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchPackages();
        return () => { cancelled = true; };
    }, []);

    const selectedPackage = useMemo(() => packages.find((item) => item._id === selectedPackageId), [packages, selectedPackageId]);
    const selectedAmount = selectedPackage?.serviceAmounts?.find((item) => item._id === selectedAmountId);

    const choosePhoto = (setter) => (event) => {
        const file = event.target.files?.[0] || null;
        event.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setFormError("Photos must be image files.");
            return;
        }
        if (file.size > MAX_IMG_BYTES) {
            setFormError("Each photo must be 200KB or smaller.");
            return;
        }
        setFormError("");
        setter(file);
    };

    const updatePerson = (setter, people, id, key, value) => {
        setter(people.map((person) => person.id === id ? { ...person, [key]: value } : person));
    };

    const validateForm = () => {
        if (!selectedPackage) return "Choose an available service.";
        if (!selectedAmountId) return "Choose a service amount.";
        if (!devoteeName.trim()) return devoteeType === "organization" ? "Contact person's name is required." : "Devotee name is required.";
        if (devoteeType === "organization" && !devoteeCompanyName.trim()) return "Organization name is required.";
        const people = devoteeType === "organization" ? employees : familyMembers;
        for (const [index, person] of people.entries()) {
            const entry = devoteeType === "organization" ? "Employee" : "Family member";
            if (!person.name.trim()) return `${entry} ${index + 1}: enter a name.`;
            if (!person.photo) return `${entry} ${index + 1}: choose a photo.`;
            if (devoteeType === "individual" && !person.relation.trim()) return `Family member ${index + 1}: enter their relation.`;
        }
        return "";
    };

    const handleBooking = async (event) => {
        event.preventDefault();
        if (!isLoggedIn) {
            navigate("/auth", { state: { from: `${location.pathname}${location.search}` } });
            return;
        }
        const validation = validateForm();
        if (validation) {
            setFormError(validation);
            return;
        }
        const formData = new FormData();
        formData.append("servicePackageId", selectedPackage._id);
        formData.append("serviceAmountId", selectedAmountId);
        formData.append("devoteeType", devoteeType);
        formData.append("devoteeName", devoteeName.trim());
        formData.append("devoteeCompanyName", devoteeCompanyName.trim());
        formData.append("devoteeDesignation", devoteeDesignation.trim());
        formData.append("traditionalIntention", traditionalIntention.trim());
        formData.append("gotra", gotra.trim());
        formData.append("sankalp", sankalp.trim());
        formData.append("preferredDate", preferredDate);
        formData.append("preferredLocation", preferredLocation.trim());
        formData.append("employees", JSON.stringify(devoteeType === "organization"
            ? employees.map(({ name }) => ({ name: name.trim() }))
            : []));
        formData.append("familyMembers", JSON.stringify(devoteeType === "individual"
            ? familyMembers.map(({ name, relation }) => ({ name: name.trim(), relation: relation.trim() }))
            : []));
        if (devoteePhoto) formData.append("devoteePhoto", devoteePhoto);
        if (devoteeType === "organization") {
            employees.forEach((person) => formData.append("employeePhotos", person.photo));
        } else {
            familyMembers.forEach((person) => formData.append("familyPhotos", person.photo));
        }

        setPaying(true);
        setFormError("");
        const toastId = toast.loading("Preparing your service booking...");
        try {
            const orderResponse = await axios.post(serviceBookingUrl.createOrder, formData, {
                headers: authHeader,
                withCredentials: true,
            });
            if (!orderResponse.data?.success || !orderResponse.data?.razorpay?.orderId) {
                throw new Error(orderResponse.data?.message || "Could not create a payment order.");
            }
            const { serviceBookingId, bookingNo, razorpay: razorpayConfig, user: bookingUser } = orderResponse.data;
            toast.loading("Opening secure Razorpay checkout...", { id: toastId });
            const paymentResponse = await openCheckout({
                key: razorpayConfig.keyId,
                amount: razorpayConfig.amount,
                currency: razorpayConfig.currency,
                order_id: razorpayConfig.orderId,
                name: "Gupt Upasana Temple",
                description: selectedPackage.serviceName,
                image: "/logo.png",
                prefill: {
                    name: bookingUser?.name || user?.name || "",
                    email: bookingUser?.email || user?.email || "",
                    contact: bookingUser?.contact || user?.phone || "",
                },
                notes: { serviceName: selectedPackage.serviceName, bookingNo },
                theme: { color: "#4A0A0D" },
            });
            toast.loading("Verifying your payment...", { id: toastId });
            const verifyResponse = await axios.post(serviceBookingUrl.verifyPayment, {
                serviceBookingId,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
            }, {
                headers: authHeader,
                withCredentials: true,
            });
            if (!verifyResponse.data?.success) {
                throw new Error(verifyResponse.data?.message || "Payment verification failed.");
            }
            setCompletedBooking(verifyResponse.data.serviceBooking);
            toast.success("Service booking confirmed after payment. 🙏", { id: toastId });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Booking could not be completed.";
            if (message.toLowerCase().includes("dismiss")) {
                toast.error("Payment cancelled. Your booking has not been confirmed.", { id: toastId });
            } else {
                toast.error(message, { id: toastId });
                setFormError(message);
            }
        } finally {
            setPaying(false);
        }
    };

    const addPerson = (setter, people) => setter([...people, makePerson()]);
    const removePerson = (setter, people, id) => setter(people.filter((person) => person.id !== id));

    return (
        <div className="min-h-screen bg-[#FAF6EE] text-gray-800">
            <section className="relative overflow-hidden border-b-4 border-[#e7c66b] bg-gradient-to-br from-[#1c0406] via-[#4a0a0d] to-[#1a0305] px-5 py-14 text-center text-white sm:py-20">
                {/* <Sparkles size={32} className="mx-auto mb-4 text-[#e7c66b]" /> */}
                <h1 className="font-serif text-3xl font-black text-[#e7c66b] sm:text-5xl">Book a Sacred Service</h1>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">Choose a puja, havan or seva offering and share the details for your sankalp.</p>
            </section>

            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
                {completedBooking ? (
                    <section className="mx-auto max-w-2xl rounded-3xl border border-green-200 bg-white p-7 text-center shadow-xl sm:p-10">
                        <CheckCircle2 size={50} className="mx-auto text-green-600" />
                        <h2 className="mt-5 font-serif text-2xl font-black text-[#4a0a0d]">Booking received</h2>
                        <p className="mt-2 text-sm text-gray-600">Your payment was verified. The temple team will follow up to confirm the service details.</p>
                        <div className="mt-6 rounded-2xl bg-[#fcfaf5] p-5 text-left">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Booking number</p>
                            <p className="mt-1 text-lg font-bold text-[#4a0a0d]">{completedBooking.bookingNo}</p>
                            <div className="mt-4 flex justify-between gap-3 text-sm"><span>{completedBooking.serviceNameSnapshot}</span><strong>{formatCurrency(completedBooking.amount, completedBooking.currency)}</strong></div>
                            <p className="mt-2 text-xs text-gray-500">Payment status: <span className="font-semibold capitalize text-green-700">{completedBooking.paymentStatus}</span></p>
                        </div>
                        <button onClick={() => { setCompletedBooking(null); setFormError(""); }} className="mt-6 rounded-xl bg-[#4a0a0d] px-5 py-3 text-sm font-bold text-[#e7c66b]">Book another service</button>
                    </section>
                ) : (
                    <>
                        {loadError && <div role="alert" className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><CircleAlert size={18} />{loadError}</div>}
                        {loading ? (
                            <div className="rounded-2xl bg-white py-20 text-center text-sm text-gray-500"><RefreshCw size={24} className="mx-auto mb-3 animate-spin text-[#98701b]" />Loading available services...</div>
                        ) : packages.length === 0 ? (
                            <div className="rounded-2xl bg-white py-16 text-center">
                                <Sparkles size={30} className="mx-auto text-[#98701b]" />
                                <h2 className="mt-3 font-bold text-[#4a0a0d]">No services are available right now</h2>
                                <p className="mt-1 text-sm text-gray-500">Please check back soon.</p>
                            </div>
                        ) : (
                            <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                                <section>
                                    <h2 className="mb-4 font-serif text-xl font-black text-[#4a0a0d]">Choose a service</h2>
                                    <div className="space-y-4">
                                        {packages.map((item) => {
                                            const selected = item._id === selectedPackageId;
                                            return (
                                                <button key={item._id} type="button" onClick={() => { setSelectedPackageId(item._id); setSelectedAmountId(item.serviceAmounts?.[0]?._id || ""); }} className={`w-full overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition ${selected ? "border-[#8B0000] ring-2 ring-[#8B0000]/10" : "border-[#e7c66b]/30 hover:border-[#e7c66b]"}`}>
                                                    <div className="flex">
                                                        <img src={item.serviceImg?.url || fallbackImg} alt="" onError={(event) => { event.currentTarget.src = fallbackImg; }} className="h-28 w-28 shrink-0 object-cover sm:h-32 sm:w-36" />
                                                        <div className="min-w-0 flex-1 p-4">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <h3 className="font-bold text-[#4a0a0d]">{item.serviceName}</h3>
                                                                {selected && <CheckCircle2 size={18} className="shrink-0 text-[#8B0000]" />}
                                                            </div>
                                                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{item.serviceDescription || "A sacred service offering at Gupt Upasana Temple."}</p>
                                                            <p className="mt-2 text-xs font-semibold text-[#98701b]">{item.serviceCategory?.replaceAll("_", " ")}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {selectedPackage?.serviceBenefits?.length > 0 && (
                                        <div className="mt-5 rounded-2xl border border-[#e7c66b]/30 bg-white p-5">
                                            <h3 className="font-bold text-[#4a0a0d]">Service benefits</h3>
                                            <ul className="mt-3 space-y-2">{selectedPackage.serviceBenefits.map((benefit, index) => <li key={`${benefit}-${index}`} className="flex gap-2 text-sm text-gray-600"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-green-600" />{benefit}</li>)}</ul>
                                        </div>
                                    )}
                                    {selectedPackage?.serviceRules?.length > 0 && (
                                        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                                            <strong>Before booking</strong>
                                            <ul className="mt-2 list-inside list-disc space-y-1">{selectedPackage.serviceRules.map((rule, index) => <li key={`${rule}-${index}`}>{rule}</li>)}</ul>
                                        </div>
                                    )}
                                </section>

                                <form onSubmit={handleBooking} className="space-y-6 rounded-3xl border border-[#e7c66b]/35 bg-white p-5 shadow-lg sm:p-7">
                                    <div>
                                        <h2 className="font-serif text-xl font-black text-[#4a0a0d]">Booking details</h2>
                                        <p className="mt-1 text-sm text-gray-500">Your payment amount is securely confirmed by the server.</p>
                                    </div>

                                    {selectedPackage && (
                                        <div>
                                            <label className={labelClass} htmlFor="service-amount">Offering amount *</label>
                                            <div className="relative">
                                                <select id="service-amount" required value={selectedAmountId} onChange={(event) => setSelectedAmountId(event.target.value)} className={`${fieldClass} appearance-none pr-10`}>
                                                    {selectedPackage.serviceAmounts?.map((option) => (
                                                        <option key={option._id} value={option._id}>
                                                            {option.label || selectedPackage.serviceName}{option.frequency ? ` · ${frequencyNames[option.frequency] || option.frequency}` : ""} — {formatCurrency(option.amount)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8B0000]" />
                                            </div>
                                            {selectedAmount && <p className="mt-2 text-right text-sm font-bold text-[#4a0a0d]">{formatCurrency(selectedAmount.amount)}</p>}
                                        </div>
                                    )}

                                    <fieldset>
                                        <legend className={`${labelClass} mb-3`}>Booking for</legend>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[["individual", "Individual / Family"], ["organization", "Organization"]].map(([value, label]) => (
                                                <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold ${devoteeType === value ? "border-[#8B0000] bg-[#8B0000]/5 text-[#4a0a0d]" : "border-gray-200 text-gray-600"}`}>
                                                    <input type="radio" name="devoteeType" value={value} checked={devoteeType === value} onChange={() => { setDevoteeType(value); setFormError(""); }} className="accent-[#8B0000]" />
                                                    {label}
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass} htmlFor="devotee-name">{devoteeType === "organization" ? "Contact person's name *" : "Devotee name *"}</label>
                                            <input id="devotee-name" required value={devoteeName} onChange={(event) => setDevoteeName(event.target.value)} className={fieldClass} placeholder="Full name" />
                                        </div>
                                        <PhotoInput label="Devotee photo" file={devoteePhoto} onChange={choosePhoto(setDevoteePhoto)} />
                                        {devoteeType === "organization" && (
                                            <>
                                                <div>
                                                    <label className={labelClass} htmlFor="company-name">Organization name *</label>
                                                    <input id="company-name" required value={devoteeCompanyName} onChange={(event) => setDevoteeCompanyName(event.target.value)} className={fieldClass} placeholder="Organization" />
                                                </div>
                                                <div>
                                                    <label className={labelClass} htmlFor="designation">Designation</label>
                                                    <input id="designation" value={devoteeDesignation} onChange={(event) => setDevoteeDesignation(event.target.value)} className={fieldClass} placeholder="Role / designation" />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {devoteeType === "individual" ? (
                                        <section className="space-y-3 rounded-2xl bg-[#fcfaf5] p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div><h3 className="text-sm font-bold text-[#4a0a0d]">Family members</h3><p className="mt-1 text-xs text-gray-500">Optional; add a name, relation and photo for each person (up to 10).</p></div>
                                                <button type="button" disabled={familyMembers.length >= MAX_PEOPLE_PER_BOOKING} onClick={() => addPerson(setFamilyMembers, familyMembers)} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#4a0a0d] shadow-sm disabled:opacity-50"><Plus size={14} /> Add</button>
                                            </div>
                                            {familyMembers.map((person, index) => (
                                                <div key={person.id} className="grid gap-3 rounded-xl border border-[#eee8dc] bg-white p-3 sm:grid-cols-2">
                                                    <input aria-label={`Family member ${index + 1} name`} value={person.name} onChange={(event) => updatePerson(setFamilyMembers, familyMembers, person.id, "name", event.target.value)} className={fieldClass} placeholder="Family member name" />
                                                    <input aria-label={`Family member ${index + 1} relation`} value={person.relation} onChange={(event) => updatePerson(setFamilyMembers, familyMembers, person.id, "relation", event.target.value)} className={fieldClass} placeholder="Relation" />
                                                    <PhotoInput label={`Family member ${index + 1} photo`} file={person.photo} onChange={choosePhoto((photo) => updatePerson(setFamilyMembers, familyMembers, person.id, "photo", photo))} required />
                                                    <button type="button" onClick={() => removePerson(setFamilyMembers, familyMembers, person.id)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"><Trash2 size={14} /> Remove</button>
                                                </div>
                                            ))}
                                        </section>
                                    ) : (
                                        <section className="space-y-3 rounded-2xl bg-[#fcfaf5] p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div><h3 className="text-sm font-bold text-[#4a0a0d]">Employees</h3><p className="mt-1 text-xs text-gray-500">Optional; add a name and photo for each person (up to 10).</p></div>
                                                <button type="button" disabled={employees.length >= MAX_PEOPLE_PER_BOOKING} onClick={() => addPerson(setEmployees, employees)} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#4a0a0d] shadow-sm disabled:opacity-50"><Plus size={14} /> Add</button>
                                            </div>
                                            {employees.map((person, index) => (
                                                <div key={person.id} className="grid gap-3 rounded-xl border border-[#eee8dc] bg-white p-3 sm:grid-cols-2">
                                                    <input aria-label={`Employee ${index + 1} name`} value={person.name} onChange={(event) => updatePerson(setEmployees, employees, person.id, "name", event.target.value)} className={fieldClass} placeholder="Employee name" />
                                                    <PhotoInput label={`Employee ${index + 1} photo`} file={person.photo} onChange={choosePhoto((photo) => updatePerson(setEmployees, employees, person.id, "photo", photo))} required />
                                                    <button type="button" onClick={() => removePerson(setEmployees, employees, person.id)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 sm:col-span-2"><Trash2 size={14} /> Remove employee</button>
                                                </div>
                                            ))}
                                        </section>
                                    )}

                                    <section className="space-y-4">
                                        <h3 className="text-sm font-bold text-[#4a0a0d]">Sankalp and preferences</h3>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div><label className={labelClass} htmlFor="gotra">Gotra</label><input id="gotra" value={gotra} onChange={(event) => setGotra(event.target.value)} className={fieldClass} placeholder="Gotra (optional)" /></div>
                                            <div><label className={labelClass} htmlFor="preferred-date">Preferred date</label><input id="preferred-date" type="date" min={new Date().toISOString().slice(0, 10)} value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} className={fieldClass} /></div>
                                            <div className="sm:col-span-2"><label className={labelClass} htmlFor="intention">Traditional intention</label><textarea id="intention" rows={2} value={traditionalIntention} onChange={(event) => setTraditionalIntention(event.target.value)} className={`${fieldClass} resize-y`} placeholder="Optional" /></div>
                                            <div className="sm:col-span-2"><label className={labelClass} htmlFor="sankalp">Sankalp details</label><textarea id="sankalp" rows={2} value={sankalp} onChange={(event) => setSankalp(event.target.value)} className={`${fieldClass} resize-y`} placeholder="Optional" /></div>
                                            <div className="sm:col-span-2"><label className={labelClass} htmlFor="location">Preferred location</label><input id="location" value={preferredLocation} onChange={(event) => setPreferredLocation(event.target.value)} className={fieldClass} placeholder="Optional" /></div>
                                        </div>
                                    </section>

                                    {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

                                    <div className="rounded-2xl border border-green-100 bg-green-50/70 p-4">
                                        <div className="flex items-start gap-3">
                                            <ShieldCheck size={19} className="mt-0.5 shrink-0 text-green-700" />
                                            <div><p className="text-sm font-bold text-green-900">Secure Razorpay payment</p><p className="mt-1 text-xs leading-relaxed text-green-800">The amount is verified against the selected service on our server before the booking is confirmed.</p></div>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={paying || loading || packages.length === 0} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4a0a0d] to-[#721117] px-5 py-4 text-sm font-bold text-[#e7c66b] shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500">
                                        {paying ? <><RefreshCw size={16} className="animate-spin" />Connecting to secure checkout...</> : <>{isLoggedIn ? `Continue to payment${selectedAmount ? ` · ${formatCurrency(selectedAmount.amount)}` : ""}` : "Sign in to book"}<ArrowRight size={16} /></>}
                                    </button>
                                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400"><LockKeyhole size={12} />Payment is processed securely by Razorpay.</p>
                                </form>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default ServiceBookingPage;
