const EvidenceSpecificPage = () => {
  return (
    <div className="w-full min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/evidence-bg.png)] bg-center bg-no-repeat bg-cover flex flex-col justify-center items-center">
      <div className="w-[calc(0.9*100%)] rounded-md h-100 bg-[url(/images/item-backgrounds/document-v1.png)] bg-center bg-cover bg-no-repeat shadow-lg brightness-125">
        <div className=" ps-4 pe-2 pt-4 leading-4.5 text-surface flex flex-col justify-center">
          <h3 className="pb-2">Lorem Ipsum</h3>
          <p className="">
            is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industrys standard dummy text ever since 1966, when designers at Letraset and James
            Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero
            translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has
            survived not only many decades.
          </p>
        </div>
      </div>
    </div>
  );
};
export default EvidenceSpecificPage;
