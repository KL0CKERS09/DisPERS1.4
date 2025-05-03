import SecondSecClient from './secondSecClient';

const getAlerts = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/alerts`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch alerts.");
    }

    return res.json();
  } catch (error) {
    console.log("FETCH ERROR:", error);
    return { alerts: [] };
  }
};

export default async function SecondSecWrapper() {
  const { alerts } = await getAlerts();
  return <SecondSecClient alerts={alerts} />;
}
