export function mockReply(message: string, style: string) {
  if (style === "Kortfattat")
    return "Absolut! Berätta vad du vill uppnå, så tar vi nästa steg. Det här är ett simulerat svar.";
  const detail =
    style === "Utförligt"
      ? "\n\nVi kan börja med att formulera målet, samla underlag och dela upp arbetet i tydliga steg. Vad är viktigast för dig att få på plats först?"
      : "";
  if (/hej|hallå/i.test(message))
    return (
      "Hej! Vad vill du jobba med idag? Jag kan hjälpa dig att bolla en idé, strukturera en uppgift eller skissa på en plan.\n\nDet här är en demo med simulerade svar. Allt stannar i din webbläsare." +
      detail
    );
  if (/plan|struktur/i.test(message))
    return (
      "Absolut, vi tar det steg för steg.\n\n1. Beskriv vad du vill uppnå.\n2. Samla det viktigaste underlaget.\n3. Dela upp arbetet i små, tydliga steg.\n4. Följ upp och justera längs vägen.\n\nVad vill du börja med? Det här svaret är simulerat och workspace-panelen lämnas tom." +
      detail
    );
  return `Jag har tagit emot ditt meddelande: ”${message.slice(0, 180)}${message.length > 180 ? "…" : ""}”\n\nHär skulle din agent kunna resonera och hjälpa dig vidare. I den här prototypen är svaret simulerat, så inga externa tjänster anropas och inga åtgärder utförs.\n\nBerätta gärna mer, så fortsätter vi samtalet.${detail}`;
}
