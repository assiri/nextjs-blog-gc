"use client";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Dexie from "dexie";
import Link from "next/link";
import styles from "./inv.module.css";
const Db = new Dexie("invoice-data");

Db.version(1).stores({
  invoice: "++id",
});

Db.open().catch((err) => {
  console.log(err.stack || err);
});
export default function App() {
  const [data, setData] = useState([]);
  const [sellerName, setSellrName] = useState("");
  const [vatRegistration, setVatRegistration] = useState("");
  const [timeStamp, setTimeStamp] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [totalAmount, setTotalAmount] = useState("");
  const [vatAmount, setVtAmount] = useState("");

  const getTLVForValue = (tagNum, tagValue) => {
    let tagBuf = Buffer.from([tagNum], "utf8");
    let tagValueLenBuf = Buffer.from([tagValue.length], "utf8");
    let tagValueBuf = Buffer.from(tagValue, "utf8");
    let bufsArray = [tagBuf, tagValueLenBuf, tagValueBuf];
    return Buffer.concat(bufsArray);
  };
  //const tlv=(seller_name="Bobs Basement Records",vat_number="100025906700003",time_stamp="2022-04-25T15:30:00Z",Invoice_amount="2100100.99",vat_amount="315015.15")=>{
  const tlv = () => {
    if (
      sellerName &&
      vatRegistration &&
      timeStamp &&
      totalAmount &&
      vatAmount
    ) {
      let sellerNameBuf = getTLVForValue("1", sellerName.toString());
      let vatRegistrationNameBuf = getTLVForValue(
        "2",
        vatRegistration.toString()
      );
      let timeStampBuf = getTLVForValue("3", timeStamp.toString());
      let taxTotalNameBuf = getTLVForValue("4", totalAmount.toString());
      let vatTotalBuf = getTLVForValue(5, vatAmount.toString());
      let tagsBufsArray = [
        sellerNameBuf,
        vatRegistrationNameBuf,
        timeStampBuf,
        taxTotalNameBuf,
        vatTotalBuf,
      ];
      let qrCodeBuf = Buffer.concat(tagsBufsArray);
      let qrCodeB64 = qrCodeBuf.toString("base64");
      Db.invoice
        .add({
          sellerName,
          vatRegistration,
          timeStamp,
          totalAmount,
          vatAmount,
          qrCodeB64,
        })
        .then(() => {
          setSellrName("");
          setVatRegistration("");
          setTotalAmount("");
          setVtAmount("");
        });

      //setUrl(qrCodeB64)
    } else {
      alert("Fill fields");
    }
  };
  useEffect(() => {
    if (totalAmount) {
      setVtAmount(Number(totalAmount) * 0.15);
    }
    Db.invoice.toArray().then((data) => setData(data));
  }, [totalAmount]);

  return (
    <div className={styles.App}>
      <Link
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        href="/"
      >
        Blogs مدونات
      </Link>
      <div className={styles.form}>
        <h1>TLV QR Code </h1>
        <form>
          <div className={styles.flexform}>
            <label>Seller's Name اسم البائع</label>
            <input
              placeholder="Seller's Name"
              value={sellerName}
              onChange={(e) => setSellrName(e.target.value)}
            />
          </div>
          <div className={styles.flexform}>
            <label>Vat registration number رقم سجل الضريبه</label>
            <input
              placeholder="Vat registration number"
              value={vatRegistration}
              onChange={(e) => setVatRegistration(e.target.value)}
            />
          </div>
          <div className={styles.flexform}>
            <label>Time stamp الوقت والتاريخ</label>
            <input
              type="date"
              placeholder="date time"
              value={timeStamp}
              onChange={(e) => setTimeStamp(e.target.value)}
            />
          </div>
          <div className={styles.flexform}>
            <label>Total amount اجمالي الفاتوره</label>
            <input
              placeholder="Invoice amount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>
          <div lassName={styles.flexform}>
            <label>Vat amount اجمالي الضريبة</label>
            <input
              placeholder="Total amount"
              value={vatAmount}
              onChange={(e) => setVtAmount(e.target.value)}
            />
          </div>
        </form>
        <hr />
        <button type="button" onClick={() => tlv()}>
          Add اضافه
        </button>
      </div>
      {data.map((r) => (
        <div lassName={styles.tbl} key={r.id}>
          <span>{r.id}</span>
          <span>{r.sellerName}</span>
          <span>{r.totalAmount}</span> <span>{r.vatAmount}</span>{" "}
          <QRCode value={r?.qrCodeB64} />
        </div>
      ))}
    </div>
  );
}
