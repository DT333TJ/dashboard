import { Button, Splitter } from "antd";
import { useEffect, useState } from "react";
import "@interactjs/auto-start";
import "@interactjs/actions/drag";
import "@interactjs/actions/resize";
import "@interactjs/modifiers";
import "@interactjs/dev-tools";
import interact from "@interactjs/interact";

interface realElementType {
  componentClassName?: string,
  componentName?: string,
  children?: realElementType[],
  noResize?: boolean;
};
interface componentType extends realElementType {
  label: string;
};

import pageConfig from '../pageConfig.json'


function App() {
  // const RealComponent = ({ obj }: { obj: realElementType }) => {
  //   const componentFuncs: Record<string, () => React.ReactElement> = {
  //     header: () => <div className=" bg-gray-500 text-white w-full min-h-20">头部</div>,
  //     test: () => <div className="bg-gray-500 text-white min-h-20">测试模块</div>,
  //     containerBlank: () => <div className="w-full h-10 bg-slate-500 shadow-inner"></div>,
  //     containerBody: () => <div className="w-full bg-gray-500 h-svh"></div>
  //   };
  //   const classNameValue = `${obj.componentClassName} ${obj.noResize ? '' : 'resizableElement'}`
  //   console.log('obj', obj, classNameValue)
  //   return (
  //     obj?.children?.length ? <div key={`${obj.componentClassName}`} className={`${classNameValue}`}>{obj?.children?.map((c, ci) => <RealComponent obj={c} key={ci} />)}</div> : componentFuncs[`${obj.componentName}`]?.()
  //   );
  // };
  const [components] = useState<(componentType)[]>([
    {
      noResize: true,
      label: "公共头部",
      "children": [
        {
          "componentName": "header"
        }
      ],
      "componentName": "containerHeader",
    },
    {
      noResize: true,
      label: "空白行",
      "componentName": "containerBlank"
    },
    {
      label: "主要内容",
      "componentName": "containerBody"
    },
    {
      label: "测试模块",
      componentName: "test",
    },
  ]);
  const [realElements, setRealElements] = useState<realElementType[]>([...pageConfig]);
  const onDragEvent = (ev: React.DragEvent<HTMLElement>, type: string, item?: componentType) => {
    const stopPropagation = () => {
      ev.preventDefault();
      ev.stopPropagation();
    };
    const eventObj: Record<string, () => void> = {
      start: () => ev.dataTransfer.setData("Text", JSON.stringify({ dataType: "start", data: item })),
      end: () => (ev.target as HTMLSpanElement).classList.remove("dropValueContainer"),
      over: () => {
        stopPropagation();
      },
      drop: () => {
        stopPropagation();
        const dataTransferData = ev?.dataTransfer?.getData("Text");
        // 传递的值
        const data = dataTransferData ? JSON.parse(dataTransferData)?.data : null;
        const newElements = realElements.concat([data]);
        setRealElements([...newElements]);
      },
    };
    eventObj[type]?.();
  };
  const renderedComponentFunc = (obj: realElementType, i: number) => {
    const classNameValue = obj.componentClassName || ''
    const componentFuncs: Record<string, () => React.ReactElement> = {
      header: () => <div key={i} className="bg-gray-500 text-white w-full min-h-20">头部</div>,
      test: () => <div key={i} className="bg-gray-500 text-white w-full min-h-20 resizableElement">测试模块</div>,
      containerBlank: () => <div key={i} className="w-full h-5 bg-white shadow-inner"></div>,
      containerHeader: () => <div key={i} className="sticky top-0 left-0 w-full h-auto"></div>,
      containerBody: () => <div key={i} className="w-10/12 mx-auto my-0 h-screen"></div>,
      "container-1/3": () => <div key={i} className="grid gap-2 grid-cols-3 h-auto"></div>,
      "container-1/2": () => <div key={i} className="grid gap-2 grid-cols-2 h-auto"></div>
    };
    return (
      obj?.children?.length ?
        <div className={`${classNameValue} ${obj.noResize ? '' : 'resizableElement'}`} key={`${i + Date.now()}`}>
          {obj.children?.map((c, ci) => renderedComponentFunc(c, ci + i))}
        </div> : (componentFuncs[`${obj.componentName}`]?.())
    );
  };

  useEffect(() => {
    if (interact) {
      interact(".resizableElement").resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            var target = event.target;
            var x = parseFloat(target.getAttribute("data-x")) || 0;
            var y = parseFloat(target.getAttribute("data-y")) || 0;
            // update the element's style
            target.style.width = event.rect.width + "px";
            target.style.height = event.rect.height + "px";
            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;
            target.style.transform = "translate(" + x + "px," + y + "px)";
            target.setAttribute("data-x", x);
            target.setAttribute("data-y", y);
          },
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: "parent",
          }),
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 100, height: 50 },
          }),
        ],
      })
      // .draggable({
      //   listeners: {
      //     start(event) {
      //       console.log(event.type, event.target)
      //     },
      //     move: dragMoveListener
      //   },
      //   modifiers: [
      //     interact.modifiers.restrictRect({
      //       restriction: 'parent',
      //     })
      //   ],
      // });
      // function dragMoveListener(event: React.DragEvent<HTMLElement> & { 'dx': number, 'dy': number }) {
      //   var target = event.target as HTMLElement
      //   console.log('event', event)
      //   // keep the dragged position in the data-x/data-y attributes
      //   var x = (parseFloat(target.getAttribute('data-x') as string) || 0) + event['dx']
      //   var y = (parseFloat(target.getAttribute('data-y') as string) || 0) + event['dy']

      //   // translate the element
      //   target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

      //   // update the posiion attributes
      //   target.setAttribute('data-x', x + '')
      //   target.setAttribute('data-y', y + '')
      // }
    }
  }, []);

  return (
    <>
      <Splitter>
        <Splitter.Panel defaultSize="20%" min="20%" max="20%">
          <div className="h-screen overflow-x-hidden">
            <div className="flex flex-wrap">
              {components.map((component) => (
                <Button key={component['label']} className="m-1" draggable="true" onDragStart={(ev) => onDragEvent(ev, "start", component)}>
                  {component.label}
                </Button>
              ))}
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div className="h-screen w-full" onDragOver={(ev) => onDragEvent(ev, "over")} onDrop={(ev) => onDragEvent(ev, "drop")}>
            {realElements?.map((realElement, i) => renderedComponentFunc(realElement, i))}
          </div>
        </Splitter.Panel>
      </Splitter>
    </>
  );
}

export default App;
