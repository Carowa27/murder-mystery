export const AdminOverviewSection = () => {
  return (
    <div className="ms-4">
      <h3 className="text-center">Välkommen till Admin Portalen!</h3>
      <p className="!text-xl pb-2 pt-4">Här kan du</p>
      <ul className="list-disc list-inside">
        <li>Skapa nya fall</li>
        <li>Redigera fall</li>
        <li>Sätta fall som inactive</li>
        <br />
        <li>Kolla igenom utredningar</li>
        <br />
        <li>Se över profiler</li>
        <li>Redigera profiler</li>
      </ul>
    </div>
  );
};
