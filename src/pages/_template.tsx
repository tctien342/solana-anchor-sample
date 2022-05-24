const TemplatePage: IPageComponent = () => {
  return <div className="h-screen bg-white text-zinc-700 flex flex-col relative"></div>;
};

TemplatePage.getLayout = (children) => children;

export default TemplatePage;
