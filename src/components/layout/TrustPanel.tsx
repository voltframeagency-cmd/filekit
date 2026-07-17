"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";

export default function TrustPanel() {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white border border-fk-border rounded-fk-xl shadow-sm overflow-hidden p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 md:divide-x md:divide-fk-border rtl:md:divide-x-reverse">
        {/* Column 1: 100% Private */}
        <div className="flex items-start gap-4 px-2">
          <div className="text-fk-text shrink-0 mt-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 0v1.5"
              />
            </svg>
          </div>
          <div className="flex flex-col text-left ltr:text-left rtl:text-right">
            <span className="text-[15px] font-bold text-fk-text leading-tight">
              {t("trust.privateTitle")}
            </span>
            <span className="text-[12px] text-fk-text-muted mt-1 leading-normal">
              {t("trust.privateDesc1")}
              <br />
              {t("trust.privateDesc2")}
            </span>
          </div>
        </div>

        {/* Column 2: Local First */}
        <div className="flex items-start gap-4 px-2 md:pl-6 rtl:md:pr-6 rtl:md:pl-2">
          <div className="text-fk-text shrink-0 mt-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <div className="flex flex-col text-left ltr:text-left rtl:text-right">
            <span className="text-[15px] font-bold text-fk-text leading-tight">
              {t("trust.localTitle")}
            </span>
            <span className="text-[12px] text-fk-text-muted mt-1 leading-normal">
              {t("trust.localDesc1")}
              <br />
              {t("trust.localDesc2")}
            </span>
          </div>
        </div>

        {/* Column 3: Temporary Only */}
        <div className="flex items-start gap-4 px-2 md:pl-6 rtl:md:pr-6 rtl:md:pl-2">
          <div className="text-fk-text shrink-0 mt-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
              />
            </svg>
          </div>
          <div className="flex flex-col text-left ltr:text-left rtl:text-right">
            <span className="text-[15px] font-bold text-fk-text leading-tight">
              {t("trust.tempTitle")}
            </span>
            <span className="text-[12px] text-fk-text-muted mt-1 leading-normal">
              {t("trust.tempDesc1")}
              <br />
              {t("trust.tempDesc2")}
            </span>
          </div>
        </div>

        {/* Column 4: No Hidden Trials */}
        <div className="flex items-start gap-4 px-2 md:pl-6 rtl:md:pr-6 rtl:md:pl-2">
          <div className="shrink-0 mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-fk-success text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div className="flex flex-col text-left ltr:text-left rtl:text-right">
            <span className="text-[15px] font-bold text-fk-text leading-tight">
              {t("trust.trialTitle")}
            </span>
            <span className="text-[12px] text-fk-text-muted mt-1 leading-normal">
              {t("trust.trialDesc1")}
              <br />
              {t("trust.trialDesc2")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
