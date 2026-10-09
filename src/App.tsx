import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTranslation } from "react-i18next";
import "./i18n";
import type { Page, Quest } from "./interfaces";
import { quests } from "./constants/quests";
import "./index.css";

const dayKey = () => dayjs().format("YYYY-MM-DD");
const makeDaily = () => {
  let seed = Number(dayjs().format("YYYYMMDD"));
  return quests
    .map((quest) => {
      seed = (seed * 9301 + 49297) % 233280;
      return { quest, order: seed };
    })
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)
    .map(({ quest }) => quest);
};
type Store = {
  day: string;
  active: Quest[];
  completed: string[];
  history: Record<string, string[]>;
  replace: (index: number) => void;
  complete: (title: string) => void;
  reset: () => void;
};
const useStore = create<Store>()(
  persist(
    (set, get) => ({
      day: dayKey(),
      active: makeDaily(),
      completed: [],
      history: {},
      replace: (index) => {
        const current = get().active;
        const available = quests.filter(
          (q) => !current.some((a) => a.title === q.title),
        );
        if (!available.length) return;

        const replacement =
          available[Math.floor(Math.random() * available.length)];
        if (!replacement) return;

        set({
          active: current.map((q, i) => (i === index ? replacement : q)),
        });
      },
      complete: (title) =>
        set((state) => ({
          completed: state.completed.includes(title)
            ? state.completed
            : [...state.completed, title],
          history: {
            ...state.history,
            [dayKey()]: [
              ...new Set([...(state.history[dayKey()] || []), title]),
            ],
          },
        })),
      reset: () => set({ day: dayKey(), active: makeDaily(), completed: [] }),
    }),
    { name: "touchgrass-quests" },
  ),
);

export function App() {
  const { day, active, completed, history, replace, complete, reset } =
    useStore();
  const [page, setPage] = useState<Page>("welcome");
  const { t: translate, i18n } = useTranslation();
  const t = {
    app: translate("app"),
    welcome: translate("welcome"),
    intro: translate("intro"),
    start: translate("start"),
    history: translate("history"),
    today: translate("today"),
    choose: translate("choose"),
    proof: translate("proof"),
    add: translate("add"),
    check: translate("check"),
    checking: translate("checking"),
    complete: translate("complete"),
    done: translate("done"),
    outside: translate("outside"),
    empty: translate("empty"),
    mismatch: translate("mismatch"),
    missing: translate("missing"),
    tryAgain: translate("tryAgain"),
    congrats: translate("congrats"),
  };
  const language = i18n.language;
  const [selected, setSelected] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  useEffect(() => {
    if (day !== dayKey()) reset();
  }, [day, reset]);
  const quest = active[selected] ?? (active.length ? active[0] : null);
  if (!quest) return null;
  const choose = (index: number) => {
    setSelected(index);
    setPhoto(null);
    setFile(null);
    setMessage("");
    setMessageType("success");
  };
  const upload = (next?: File) => {
    if (next) {
      setFile(next);
      setPhoto(URL.createObjectURL(next));
      setMessage("");
      setMessageType("success");
    }
  };
  const check = async () => {
    if (!file || completed.includes(quest.title)) return;
    setChecking(true);
    try {
      const image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          quest: quest.title,
          instruction: quest.copy,
        }),
      });
      const result = await response.json();
      const raw =
        result.message?.content ||
        result.choices?.[0]?.message?.content ||
        result;
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      const valid = parsed.valid ?? parsed.is_valid;
      if (!response.ok || !valid) throw new Error(t.mismatch);
      const completedToday = [...completed, quest.title];
      complete(quest.title);
      setPhoto(null);
      setFile(null);
      const nextIndex = active.findIndex(
        (item) => !completedToday.includes(item.title),
      );
      if (nextIndex === -1) setMessage(t.congrats);
      else {
        setSelected(nextIndex);
        setMessage("✓");
      }
      setMessageType("success");
    } catch (error) {
      setPhoto(null);
      setFile(null);
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : t.tryAgain);
    } finally {
      setChecking(false);
    }
  };
  const lang = (
    <div className="language">
      <button
        className={language === "en" ? "active" : ""}
        onClick={() => i18n.changeLanguage("en")}
      >
        EN
      </button>
      <button
        className={language === "id" ? "active" : ""}
        onClick={() => i18n.changeLanguage("id")}
      >
        ID
      </button>
    </div>
  );
  if (page === "welcome")
    return (
      <main className="simple-page welcome">
        <div className="topline">
          <div className="brand">{t.app}</div>
          {lang}
        </div>
        <div className="welcome-center">
          <div className="welcome-icon">🌱</div>
          <h1>{t.welcome}</h1>
          <p>{t.intro}</p>
          <button className="primary" onClick={() => setPage("quests")}>
            {t.start}
          </button>
        </div>
        <button className="text-button" onClick={() => setPage("history")}>
          {t.history}
        </button>
      </main>
    );
  if (page === "history") {
    const month = dayjs().format("MMMM YYYY");
    const days = Object.entries(history).filter(
      ([date, items]) => dayjs(date).isSame(dayjs(), "month") && items.length,
    );
    return (
      <main className="simple-page">
        <header className="page-header">
          <button className="back" onClick={() => setPage("welcome")}>
            ←
          </button>
          <h1>{month}</h1>
          {lang}
        </header>
        <div className="history">
          <p className="muted">{t.outside}</p>
          {days.length ? (
            days
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, items]) => (
                <div className="history-row" key={date}>
                  <b>{dayjs(date).format("ddd, MMM D")}</b>
                  <span>
                    {items.length} {language === "en" ? "quest" : "misi"} ✓
                  </span>
                </div>
              ))
          ) : (
            <p className="empty">{t.empty}</p>
          )}
        </div>
      </main>
    );
  }
  return (
    <main className="simple-page">
      <header className="page-header">
        <button className="back" onClick={() => setPage("welcome")}>
          ←
        </button>
        <h1>{t.today}</h1>
        <button className="history-link" onClick={() => setPage("history")}>
          {language === "en" ? "History" : "Riwayat"}
        </button>
        {lang}
      </header>
      <p className="muted">
        {dayjs().format("dddd, MMMM D")} · {t.choose}
      </p>
      <div className="quest-list">
        {active.map((item, index) => (
          <div
            className={`quest-row ${index === selected ? "selected" : ""}`}
            key={item.title}
          >
            <button className="quest-main" onClick={() => choose(index)}>
              <span className="quest-icon">
                {completed.includes(item.title) ? "✓" : item.icon}
              </span>
              <span>
                <b>{language === "en" ? item.title : item.titleId}</b>
                <small>{language === "en" ? item.copy : item.copyId}</small>
              </span>
            </button>
            {completed.includes(item.title) ? (
              <span className="done">{t.done}</span>
            ) : (
              <button
                className="swap"
                onClick={() => {
                  replace(index);
                  choose(index);
                }}
              >
                ↻
              </button>
            )}
          </div>
        ))}
      </div>
      {active.every((item) => completed.includes(item.title)) ? (
        <div className="congrats">{t.congrats}</div>
      ) : (
        <div className="proof-box">
          <p>
            {t.proof} <b>{language === "en" ? quest.title : quest.titleId}</b>
          </p>
          <label className="upload">
            {photo ? (
              <img src={photo} alt="Quest proof" />
            ) : (
              <span>{t.add}</span>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </label>
          <button
            className="primary full"
          disabled={!photo || completed.includes(quest.title) || checking}
            onClick={check}
          >
          {checking ? t.checking : completed.includes(quest.title) ? t.complete : t.check}
          </button>
          {message && <p className={`message ${messageType}`}>{message}</p>}
        </div>
      )}
    </main>
  );
}
export default App;
