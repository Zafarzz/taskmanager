import { memo } from "react";
import tg from '../../assets/images/tg.svg';
import mainlogo from '../../assets/images/mainlogo.svg';

const NotTelegram = () => {
  return <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-500 to-blue-500 pb-16">
      <div className="text-center">
          <div className="text-white text-3xl font-bold mb-6 flex justify-center items-center gap-2">
            <img src={mainlogo} alt="tg" className="h-[30px]" /> 
            <span className="text-4xl font-sfpro">PlanJet</span>
          </div>
          <p className="text-white text-lg mb-12 font-bold px-3 font-sfpro">Внедряйте наш инструмент для упрощения работы в Telegram</p>
          <a href="https://t.me/plan_jet_bot/PlanJet" className="font-bold bg-white text-blue-500 px-6 py-3 rounded-full inline-flex items-center space-x-2">
              <span className="font-sfpro">Начать</span>
              <img src={tg} alt="tg" />
          </a>
      </div>
    </div>
}

export default memo(NotTelegram);