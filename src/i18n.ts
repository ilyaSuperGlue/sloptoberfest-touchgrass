import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { app: "Touch Grass Quest", welcome: "Touch grass.", intro: "Three small outdoor quests every day.", start: "Start today", history: "View this month's history →", today: "Today's quests", choose: "choose one", proof: "Proof for", add: "＋ Add photo", check: "Check photo", complete: "Completed ✓", done: "Done", outside: "Days outside", empty: "No quests completed yet.", mismatch: "That photo does not match this quest.", missing: "Gemma endpoint missing.", tryAgain: "Try another photo.", congrats: "You completed today's quests. Nice work getting outside! 🌿" } },
  id: { translation: { app: "Touch Grass Quest", welcome: "Ayo ke luar.", intro: "Tiga misi kecil di luar ruangan setiap hari.", start: "Mulai hari ini", history: "Lihat riwayat bulan ini →", today: "Misi hari ini", choose: "pilih satu", proof: "Bukti untuk", add: "＋ Tambah foto", check: "Periksa foto", complete: "Selesai ✓", done: "Selesai", outside: "Hari di luar", empty: "Belum ada misi yang selesai.", mismatch: "Foto itu tidak sesuai dengan misi ini.", missing: "Endpoint Gemma belum tersedia.", tryAgain: "Coba foto lain.", congrats: "Kamu menyelesaikan semua misi hari ini. Hebat, sudah keluar! 🌿" } },
};

i18n.use(initReactI18next).init({ resources, lng: "en", fallbackLng: "en", interpolation: { escapeValue: false } });
export default i18n;
