import { DetailViewSection } from "./sections/DetailViewSection";

export const Frame = (): JSX.Element => {
  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <div className="w-full max-w-[1280px] flex flex-col gap-6">
''        <DetailViewSection />
      </div>
    </div>
  );
};
