"use client";

// import { useQuery } from "@tanstack/react-query";
// import { motion } from "framer-motion";
// import { supabase } from "@/lib/supabase";
import { useApp } from "@/contexts/AppContext";
import Nav from "@/components/Nav";
import SideBar from "@/components/SideBar";

import PageDatabase from "@/components/PageDatabase";
import { useNavigate } from "react-router-dom";

import { Copy, X } from "lucide-react";
import MyModal from "@/components/MyModal";
import { useEffect, useState } from "react";
import MobileBlocker from "@/components/MobileBlocker";
import useIsMobile from "@/hooks/useIsMobile";

const Dashboard = ({ mode }: { mode: string }) => {
  const { user } = useApp();

  const navigate = useNavigate();

  const [modalLink, _setModalLink] = useState<string>("No link available");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const generateLink = () => {
    return `https://baserryai/dashboard/${modalLink}&upload`;
  };

  useEffect(() => {
    generateLink();
  }, [modalLink]);

  if (!user) {
    navigate("../login");
  }

  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileBlocker />;
  }
  return (
    <>
      <div className="w-full h-screen overflow-hidden flex-col flex bg-[#F5F5F5]">
        <Nav withLogin={false}></Nav>
        <div className="flex w-full h-full">
          <SideBar></SideBar>
          <div className="flex w-full pb-[2%]">
            <PageDatabase mode={mode} />
          </div>
        </div>
      </div>

      <MyModal modalOpen={modalOpen}>
        <>
          <header className="flex justify-end w-full">
            <div className="border-[1px] px-[5px] py-[5px] rounded-[100%] flex justify-center items-center">
              <X
                size={20}
                strokeWidth={1.5}
                onClick={() => setModalOpen(false)}
                className="cursor-pointer   text-[#414141] duration-150 transition-all hover:text-[#000000]"
              ></X>
            </div>
          </header>
          <section className="w-full flex-col items-center  pt-[1%] flex h-full">
            <p className="text-[25px] font-primary font-bold">
              Udostępnij link do tabeli
            </p>
            <p className="text-[17px] pt-[2%] text-[#6f6f6f] text-center w-[70%] font-primary">
              Współpracuj z wieloma osobami nad tą samą tabelą.
            </p>
          </section>
          <section className="w-full flex-col items-center  pt-[1%] flex h-full">
            <div className="w-[85%] h-[25%] items-center rounded-xl py-[1px] flex border-[1px]">
              <div className="bg-[#ececec] justify-between items-center rounded-xl pr-[2.5%] flex w-full h-full my-[1px] mx-[1px]">
                <input
                  type="text"
                  className="outline-0 cursor-not-allowed w-full pl-[2.5%] pr-[5%]"
                  disabled
                  // value={`https://baserryai/dashboard/${"tab"}&upload&9248914111924841948100`}
                  value={generateLink().split("dashboard/")[0] + "..."}
                />
                <span title="Kopiuj">
                  <Copy
                    size={18}
                    className="cursor-not-allowed"
                    // onClick={copyToClipboard}
                    color="#c6c6c650"
                  ></Copy>
                </span>
              </div>
            </div>
            <p className="text-[13px] pt-[2%] text-[#454545] text-center w-[70%] font-primary font-medium">
              UWAGA: FUNKCJA DOSTĘPNA W NASTĘPNEJ AKTUALIZACJI
            </p>
          </section>
        </>
      </MyModal>
    </>
  );
};

export default Dashboard;
