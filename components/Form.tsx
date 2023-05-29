"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import InputText from "./InputText";
import FileUploader from "./FileUploader";
import Papa from "papaparse";
import { FileReader } from "@kanaries/web-data-loader";

import { chatCompletation } from "../services/chatgpt"
import { getValidVegaSpec, matchQuote } from '../utils'

import { inferDatasetMeta } from "../utils/inferType";
import ReactEcharts from 'echarts-for-react'
import {ReactEChart} from "../components/ReactEchart"


import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import VizChat from "./VizChat"
// import { error } from "console";

const DUMMY_RESP = [
  {
      "role": "user",
      "content": "show me value in bar chart  with country in x-axis and year in x-axis"
  },
  {
      "role": "assistant",
      "content": "Sure! Here's the vega-lite specification for a bar chart with country in the x-axis and year in the y-axis:\n\n```json\n{\n  \"mark\": \"bar\",\n  \"encoding\": {\n    \"x\": {\"field\": \"Country or Area\", \"type\": \"nominal\"},\n    \"y\": {\"aggregate\": \"sum\", \"field\": \"Value\", \"type\": \"quantitative\"},\n    \"color\": {\"field\": \"Unit\", \"type\": \"nominal\"}\n  },\n  \"selection\": {\"grid\": {\"type\": \"interval\", \"bind\": \"scales\"}},\n  \"$schema\": \"https://vega.github.io/schema/vega-lite/v4.json\"\n}\n```\n\nPlease note that I have aggregated the `Value` field using the `sum` function, as it is a quantitative field and we are using a bar chart. Also, I have added a color encoding for the `Unit` field."
  }
]

export default function Form(props) {
  const [file, setFile] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [dataset, setDataset] = useState(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false)

  const [userQuery, setUserQuery] = useState()
  const [chat, setChat] = useState([])

  const [dsList, setDsList] = useState()
  const [dataSetKey, setDataSetKey] = useState(null)

  // const fileReader = new FileReader();
  const fileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files !== null) {
      const fileData: File = files[0];

      FileReader.csvReader({
        file: fileData,
        config: { type: "reservoirSampling", size: Infinity },
        encoding: "utf-8",
      }).then((data) => {
        console.log(data, "<<< CEKK data")
        const dataset = inferDatasetMeta(data);
        // onDatasetCreated(dataset);
        // setModalOpen(true);
        setDataset(dataset);
      })
      setFile(fileData)
    }
  }, []);

  const handleGenerate = useCallback(() => {
    const latestQuery = {
      role: "user",
      content: userQuery
    }
    const fields = dataset.fields
    setIsLoading(true)
    chatCompletation([...chat, latestQuery], {fields, dataSource: dataset.dataSource}).then((res) => {

      console.log(dataset,res, fields , "<< CEK UPLOAD");
      if (res.choices.length > 0) {
        const spec = matchQuote(
            res.choices[0].message.content,
            "{",
            "}"
        );
        if (spec) {
            setChat([...chat, latestQuery, res.choices[0].message]);
        } else {
            setChat([...chat, latestQuery, {
                role: 'assistant',
                content: 'There is no relative visualization for your query. Please check the dataset and try again.',
            }]);
            // throw new Error(
            //     "No visualization matches your instruction.\n" +
            //         res.choices[0].message.content
            // );
        }
        
    setIsLoading(false)
    }
    }).catch((error) => {
      
    setIsLoading(false)
      console.log(error, "<< CEK ERROR")
    })

    // chat.forEach((item) => (
    //   console.log(getValidVegaSpec(item.content), "<<  CEK VEGA SPEC")
    // ))

  }, [userQuery, chat, dataset])

  const handleUploadFile = (event) => {
    // console.log(event.target.files, "<< CEK");
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    const loadCSV = async () => {
      const loader = new CSVLoader(file);
      const docs = await loader.load();
      console.log(docs, file, "<< CEKCHAT dataoption")
      

// console.log(vectorStore);
    }

    if (file !== null) {
      loadCSV()
    }

  }, [file])


  return (
    <div className="flex flex-col w-1/2 gap-4 items-center">
      <FileUploader handleUploadFile={fileUpload} file={file} ref={fileRef} />
      <div className="flex flex-col gap-3 w-full items-end ">
        <textarea
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="text-black px-3 py-2 min-h-[96px] rounded-lg w-full outline-none focus:outline-sky-400"
        />
        <button
          className="px-3 py-2 bg-amber-500 rounded-lg max-w-fit"
          onClick={handleGenerate}
        >
          Generate
        </button>
      </div>
      <VizChat messages={chat} dataset={dataset} />
      {/* <div className="w-3/4 h-64 bg-white">
        <ReactEcharts option={{
          "xAxis": {
            "type": "category",
            "data": ["Product A", "Product B", "Product C", "Product D", "Product E", "Product F", "Product G", "Product H", "Product I", "Product J"]
          },
          "yAxis": {
            "type": "value"
          },
          "series": [
            {
              "type": "bar",
              "name": "Top 10 Products",
              "barCategoryGap": "20%",
              "data": [120, 200, 150, 80, 70, 110, 90, 160, 130, 100]
            }
          ]
        }} />

      </div> */}
      {/* <ReactEChart spec={{}} data={dataset?.dataSource ?? []} /> */}
      {
        isLoading &&
      <p className="text-white font-bold text-3xl">Loading ...</p>
      }
    </div>
  );
}
