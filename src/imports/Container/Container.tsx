import imgChatGptImageApr252026095722Pm1 from "./c3ad81675ccd0ccbec593959999f09953417daad.png";

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[88px] relative size-full">
          <p className="font-['Quicksand:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#ffe6e6] text-[16px] text-center tracking-[1.6px] uppercase whitespace-nowrap">Your reward</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[89px] relative size-full">
          <p className="font-['DM_Serif_Display:Italic',sans-serif] italic leading-[33px] relative shrink-0 text-[#ffe6e6] text-[24px] text-center whitespace-nowrap">Eat Chocolate</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[158px]">
      <Container1 />
      <Container2 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[#7f3833] content-stretch flex items-start justify-center px-[25px] py-[30px] relative rounded-[28px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(139,99,64,0.18)] border-solid inset-0 pointer-events-none rounded-[28px] shadow-[0px_3px_16.4px_0px_rgba(24,20,15,0.53),0px_2px_4px_0px_rgba(24,20,15,0.04)]" />
      <div className="h-[58px] relative shrink-0 w-[59px]" data-name="ChatGPT Image Apr 25, 2026, 09_57_22 PM 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImageApr252026095722Pm1} />
      </div>
      <Frame />
    </div>
  );
}