import "./CollectionStatus.css";

const CollectionStatus = ({ status, emptyMessage, retry }: { status: "loading" | "error" | "ready"; emptyMessage: string; retry: () => void }) => (
  <div className="collection-status" role="status">
    {status === "loading" ? <p>Se încarcă…</p> : status === "error" ? <>
      <p>Nu am putut încărca informațiile. Încearcă din nou.</p>
      <button type="button" onClick={retry}>Reîncearcă</button>
    </> : <p>{emptyMessage}</p>}
  </div>
);

export default CollectionStatus;
