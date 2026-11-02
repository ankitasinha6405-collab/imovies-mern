import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import api from "./api.js";

const fallbackMovies = [
  { _id: "demo1", title: "Interstellar", genre: ["Sci-Fi", "Adventure"], language: "English", durationMinutes: 169, rating: 8.7, description: "A journey beyond the stars to find a future for humanity.", posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { _id: "demo2", title: "The Dark Knight", genre: ["Action", "Drama"], language: "English", durationMinutes: 152, rating: 9.0, description: "A city tests the limits of justice and courage.", posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7ha Ref.jpg".replace(" Ref", "") },
  { _id: "demo3", title: "Dune: Part Two", genre: ["Sci-Fi", "Adventure"], language: "English", durationMinutes: 166, rating: 8.5, description: "A young leader faces destiny on a desert world.", posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLv.jpg" },
  { _id: "demo4", title: "La La Land", genre: ["Romance", "Musical"], language: "English", durationMinutes: 128, rating: 8.0, description: "Two dreamers chase love and ambition in Los Angeles.", posterUrl: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg" }
];

function Header() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("imovies_user") || "null"));
  function logout() {
    localStorage.removeItem("imovies_token");
    localStorage.removeItem("imovies_user");
    setUser(null);
    window.location.href = "/";
  }
  useEffect(() => {
    const update = () => setUser(JSON.parse(localStorage.getItem("imovies_user") || "null"));
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);
  return <header className="topbar"><Link className="brand" to="/">i<span>MOVIES</span></Link><nav><a href="/#movies">Movies</a><Link to="/bookings">My bookings</Link>{user ? <><span className="welcome">Hi, {user.name}</span><button className="nav-button" onClick={logout}>Log out</button></> : <Link className="nav-cta" to="/login">Sign in</Link>}</nav></header>;
}

function MovieCard({ movie }) {
  return <article className="movie-card">
    <div className="poster-wrap">
      {movie.posterUrl ? <img src={movie.posterUrl} alt={`${movie.title} poster`} onError={(e) => { e.currentTarget.style.display = "none"; }} /> : null}
      <div className="poster-fallback">{movie.title}</div>
      <span className="rating">★ {movie.rating || "New"}</span>
    </div>
    <div className="movie-info"><div className="movie-meta">{movie.language || "Hindi"} · {movie.durationMinutes || 120} min</div><h3>{movie.title}</h3><p>{(movie.genre || []).join(" · ") || "Now showing"}</p><Link className="book-button" to={`/movie/${movie._id}`}>Book tickets <span>↗</span></Link></div>
  </article>;
}

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/movies").then(({ data }) => setMovies(data.movies || [])).catch(() => setError("API is offline — showing sample movies. Start the backend to load your database."));
  }, []);
  const displayed = useMemo(() => {
    const source = movies.length ? movies : fallbackMovies;
    return source.filter(m => `${m.title} ${(m.genre || []).join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  }, [movies, search]);
  return <>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><span className="live-dot"></span> YOUR NEXT MOVIE NIGHT STARTS HERE</span><h1>Stories look<br/>better <em>on the big screen.</em></h1><p>Find your next favourite film. Pick your seats. Make it a night to remember.</p><a className="hero-button" href="#movies">Explore movies <span>↓</span></a><div className="hero-foot"><span>✦ Curated movies</span><span>✦ Easy booking</span><span>✦ Better movie nights</span></div></div>
      <div className="hero-art"><div className="orb orb-one"></div><div className="orb orb-two"></div><div className="ticket"><div className="ticket-top">ADMIT ONE <span>IM</span></div><div className="ticket-stars">✦ ✦ ✦</div><div className="ticket-title">YOUR<br/>NEXT<br/><em>STORY.</em></div><div className="ticket-bottom">GOOD FILMS. GREAT FEELINGS.</div></div><div className="art-caption">LIGHTS DOWN. WORLD OFF.</div></div>
    </section>
    <main id="movies" className="content-section"><div className="section-heading"><div><span className="eyebrow">PICK YOUR EXPERIENCE</span><h2>Now <em>showing</em></h2><p>Find the film that fits your mood.</p></div><label className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search movies or genres..." aria-label="Search movies"/></label></div>
      {error && <div className="notice">{error}</div>}
      <div className="movie-grid">{displayed.map(movie => <MovieCard key={movie._id} movie={movie}/>)}</div>
      {!displayed.length && <p className="empty">No movies match your search. Try another title or genre.</p>}
    </main>
    <footer><Link className="brand" to="/">i<span>MOVIES</span></Link><p>Make every movie night count.</p><small>Learning project · MERN stack</small></footer>
  </>;
}

function Auth({ mode }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      localStorage.setItem("imovies_token", data.token);
      localStorage.setItem("imovies_user", JSON.stringify(data.user));
      navigate("/");
      window.location.reload();
    } catch (err) { setError(err.response?.data?.message || "Could not connect to the server. Is it running?"); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><span className="eyebrow">WELCOME TO IMOVIES</span><h1>{mode === "login" ? "Good to see you." : "Join the show."}</h1><p>{mode === "login" ? "Sign in to manage your movie nights." : "Create an account to start booking."}</p>{mode === "register" && <input required maxLength="80" placeholder="Full name" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>}<input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/><input required minLength="8" type="password" placeholder="Password (at least 8 characters)" value={form.password} onChange={e => setForm({...form, password:e.target.value})}/>{error && <div className="error">{error}</div>}<button className="book-button" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"} <span>→</span></button><div className="auth-switch">{mode === "login" ? <>New here? <Link to="/register">Create an account</Link></> : <>Already a member? <Link to="/login">Sign in</Link></>}</div></form></main>;
}

function MovieDetails() {
  const { pathname } = window.location;
  const id = pathname.split("/").pop();
  const movie = fallbackMovies.find(m => m._id === id);
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0,10));
  const [time, setTime] = useState("19:30");
  const [seats, setSeats] = useState([]);
  const [message, setMessage] = useState("");
  const [realMovie, setRealMovie] = useState(movie || null);
  useEffect(() => { if (!movie) api.get(`/movies/${id}`).then(r => setRealMovie(r.data)).catch(() => setMessage("Movie not found. Add this movie to your database first.")); }, [id]);
  function toggleSeat(seat) { setSeats(old => old.includes(seat) ? old.filter(s => s !== seat) : [...old, seat]); }
  async function book() {
    if (!localStorage.getItem("imovies_token")) { setMessage("Please sign in before booking."); return; }
    if (!seats.length) { setMessage("Select at least one seat."); return; }
    try {
      const { data } = await api.post("/bookings", { movieId: realMovie._id, showDate: date, showTime: time, seats });
      setMessage(`Booking created! Reference: ${data.booking._id}. Total: ₹${data.booking.totalAmount}`);
      setSeats([]);
    } catch (e) { setMessage(e.response?.data?.message || "Booking failed."); }
  }
  if (!realMovie) return <main className="content-section details-page"><p>{message || "Loading movie..."}</p><Link to="/">← Back to movies</Link></main>;
  return <main className="content-section details-page"><Link to="/" className="back-link">← All movies</Link><div className="details-layout"><div className="details-poster">{realMovie.posterUrl && <img src={realMovie.posterUrl} alt={realMovie.title}/>}</div><div className="details-copy"><span className="eyebrow">YOUR MOVIE NIGHT</span><h1>{realMovie.title}</h1><p>{realMovie.description}</p><div className="detail-tags">{(realMovie.genre || []).map(g => <span key={g}>{g}</span>)}<span>{realMovie.language}</span><span>{realMovie.durationMinutes} min</span></div><label className="field-label">Choose date<input type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e => setDate(e.target.value)}/></label><label className="field-label">Showtime<select value={time} onChange={e => setTime(e.target.value)}><option>10:30</option><option>14:00</option><option>17:00</option><option>19:30</option><option>22:00</option></select></label><h3 className="seat-title">Select seats <small>₹180 / seat</small></h3><div className="screen">SCREEN THIS WAY</div><div className="seat-grid">{["A","B","C","D","E","F"].map(row => <div className="seat-row" key={row}><span>{row}</span>{Array.from({length:8},(_,i)=>`${row}${i+1}`).map(s => <button key={s} className={`seat ${seats.includes(s)?"selected":""}`} onClick={() => toggleSeat(s)} aria-label={`Seat ${s}`}>{s.slice(1)}</button>)}</div>)}</div><p className="selected-summary">{seats.length} seats selected · ₹{seats.length*180}</p><button className="book-button confirm-booking" onClick={book}>Confirm booking <span>→</span></button>{message && <div className="notice">{message}</div>}<small className="muted">Demo booking only; seat availability is not yet locked across concurrent users and no payment is collected.</small></div></div></main>;
}

function Bookings() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => { api.get("/bookings/my").then(r => setItems(r.data)).catch(e => setMessage(e.response?.data?.message || "Please sign in to view bookings.")); }, []);
  async function cancel(id) {
    try { await api.patch(`/bookings/${id}/cancel`); setItems(old => old.map(b => b._id === id ? {...b, status:"cancelled"} : b)); }
    catch(e) { setMessage(e.response?.data?.message || "Could not cancel booking."); }
  }
  return <main className="content-section details-page"><span className="eyebrow">YOUR CINEMA PLANS</span><h1>My <em>bookings</em></h1>{message && <div className="notice">{message}</div>}{items.map(b => <article className="booking-item" key={b._id}><div><h3>{b.movie?.title || "Movie"}</h3><p>{b.showDate} · {b.showTime} · Seats: {b.seats.join(", ")}</p><p>₹{b.totalAmount} · <strong>{b.status}</strong></p></div>{b.status === "confirmed" && <button className="nav-button" onClick={() => cancel(b._id)}>Cancel</button>}</article>)}{!items.length && !message && <p>No bookings yet. Find your next movie on the <Link to="/">home page</Link>.</p>}</main>;
}

export default function App() {
  return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/movie/:id" element={<MovieDetails/>}/><Route path="/bookings" element={<Bookings/>}/></Routes></>;
}
