import React, { useMemo, useRef,useEffect} from "react";
//import { Plate } from '@udecode/plate';
import { balloonToolbarValue } from './config/balloonToolbarValue';
import { MarkBalloonToolbar } from './config/MarkBalloonToolbar';
import { basicNodesPlugins } from './config/basicNodesPlugins';
import { editableProps } from './config/editableProps';
import { MyValue } from './config/plateTypes'
import {
  createPlateEditor,
  usePlateStates,
  Plate,
} from '@udecode/plate';
import {
  SyncElement,
  toSharedType,
  useCursors,
  withCursor,
  withYjs,
} from "slate-yjs";
import { WebsocketProvider } from "y-websocket";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import * as Y from "yjs";
import { Editor } from "slate";
import { IndexeddbPersistence } from "y-indexeddb";

const App =() => {

    const [value, setValue] = usePlateStates().value();
    // const doc = new Y.Doc();
    // const persistence = new IndexeddbPersistence("slate-yjs-demo", doc);
    // const  sharedType = doc.getArray<SyncElement>("content");
    // const provider = new WebsocketProvider("ws://127.0.0.1:1234", "slate-yjs-demo", doc, {
    //   connect: false,
    // });


    const [sharedType, provider,persistence] = useMemo(() => {
    const doc = new Y.Doc();
    const persistence = new IndexeddbPersistence("slate-yjs-demo", doc);
    const  sharedType = doc.getArray<SyncElement>("content");
    const provider = new WebsocketProvider("ws://127.0.0.1:1234", "slate-yjs-demo", doc, {
      connect: false,
    });
  
    return [sharedType, provider,persistence];
  }, []);
  
  const awareness = provider.awareness;
  
  const editor = useMemo(() => {
    const editor:any = withCursor(
      withYjs(withReact(withHistory(createPlateEditor({plugins:basicNodesPlugins}))), sharedType),
      awareness
    );
  
    return editor;
  }, [sharedType, provider,persistence]);
  awareness.setLocalStateField("user", {
    // Define a print name that should be displayed
    name: "Harper  Charpentier 3000",
    // Define a color that should be associated to the user:
    color: "#ffb61e" // should be a hex color
  });

  awareness.on("change", () => {
    // Whenever somebody updates their awareness information,
    // we log all awareness information from all users.
    console.log(Array.from(awareness.getStates().values()));
  });
  
  useEffect(() => {
    // provider.on("status", ({ status }) => {
    //   setOnlineState(status === "connected");
    // });
  
    // provider.awareness.setLocalState({
    //   alphaColor: color.slice(0, -2) + "0.2)",
    //   color,
    //   // name,
    // });
  
    // Super hacky way to provide a initial value from the client, if
    // you plan to use y-websocket in prod you probably should provide the
    // initial state from the server.
    provider.on("sync", (isSynced: boolean) => {
      if (isSynced && sharedType.length === 0) {
        toSharedType(sharedType, [
          { children: [{ text: "Hello world!" }] },
        ]);
      }
    }
    );

    // provider.on("sync", (isSynced: boolean) => {
    //   if (isSynced && sharedType.length === 0) {
    //     toSharedType(sharedType, [
    //       { children: [{ text: "Hello world!","italic":true }] },
    //     ]);
    //   }
    // });
  
    provider.connect();
  
    return () => {
      provider.disconnect();
    };
  }, [provider]);

  const toggleOnline = () => {
    provider.connect();
    
  };

  const toggleOffline = () => {
    provider.disconnect() 
  };

  return(
    <>
     <Plate<MyValue>
        //onChange={setValue}
        editor={editor}
        editableProps={editableProps}
        plugins={basicNodesPlugins}
        initialValue={balloonToolbarValue}

  >
    <MarkBalloonToolbar />
    value: {JSON.stringify(sharedType)}
    value: {JSON.stringify(value)}
  </Plate>

  <div >
        <button type="button" onClick={toggleOnline}>
          Go Online
        </button>

      </div>

  <div >
        <button type="button" onClick={toggleOffline}>
          Go Offline
        </button>

      </div>
    </>

   
  
  )
  
};

export default App;
//..............with Styles...............

// import React, { useMemo, useRef,useEffect} from "react";

// import {
//   createBlockquotePlugin,
//   createBoldPlugin,
//   createCodePlugin,
//   createHeadingPlugin,
//   createItalicPlugin,
//   createParagraphPlugin,
//   createPlugins,
//   createStrikethroughPlugin,
//   createUnderlinePlugin,
//   createPlateEditor,
//   usePlateStates,
//   Plate,
// } from '@udecode/plate';
// import {
//   SyncElement,
//   toSharedType,
//   useCursors,
//   withCursor,
//   withYjs,
// } from "slate-yjs";
// import { WebsocketProvider } from "y-websocket";
// import { withReact } from "slate-react";
// import { withHistory } from "slate-history";
// import * as Y from "yjs";
// import { basicElementsValue } from './basicElementsValue';
// import { basicMarksValue } from './basicMarksValue';
// import { editableProps } from './editableProps';
// import { plateUI } from './plateUI';
// import { MyValue } from './plateTypes';

// // try to remove a few plugins!

// // const plugins: MyPlatePlugin[] = [ 
// //   createParagraphPlugin({key: ELEMENT_PARAGRAPH,}),
// //   createBlockquotePlugin(),
// //   createCodeBlockPlugin(),
// //   createHeadingPlugin(),

// //   createBoldPlugin(),
// //   createItalicPlugin(),
// //   createUnderlinePlugin(),
// //   createStrikethroughPlugin(),
// //   createCodePlugin(),
// // ];

// const plugins = createPlugins<MyValue>(
//   [
//     createParagraphPlugin(),
//     createBlockquotePlugin(),
//     // createCodeBlockPlugin({
//     //   // You can either pass a component per plugin
//     //   component: CodeBlockElement,
//     // }),
//     createHeadingPlugin(),

//     createBoldPlugin(),
//     createItalicPlugin(),
//     createUnderlinePlugin(),
//     createStrikethroughPlugin(),
//     createCodePlugin(),
//   ],
//   {
//     // Or pass all components at once
//     components: plateUI,
//   }
// );



// const Editor = () => {
//   const [value, setValue] = usePlateStates().value();
//   const [sharedType, provider] = useMemo(() => {
//     const doc = new Y.Doc();
//     const  sharedType = doc.getArray<SyncElement>("content");
//     const provider = new WebsocketProvider("ws://127.0.0.1:1234", "slate-yjs-demo", doc, {
//       connect: false,
//     });
  
//     return [sharedType, provider];
//   }, []);
  
  
  
//   const editor:any = useMemo(() => {
//     const editor:any = withCursor(
//       withYjs(withReact(withHistory(createPlateEditor())), sharedType),
//       provider.awareness
//     );
  
//     return editor;
//   }, [sharedType, provider]);
  
//   useEffect(() => {
//     // provider.on("status", ({ status }) => {
//     //   setOnlineState(status === "connected");
//     // });
  
//     // provider.awareness.setLocalState({
//     //   alphaColor: color.slice(0, -2) + "0.2)",
//     //   color,
//     //   // name,
//     // });
  
//     // Super hacky way to provide a initial value from the client, if
//     // you plan to use y-websocket in prod you probably should provide the
//     // initial state from the server.
//     // provider.on("sync", (isSynced) => {
//     //   if (isSynced && sharedType.length === 0) {
//     //     toSharedType(sharedType, [
//     //       { type: "paragraph", children: [{ text: "Hello world!" }] },
//     //     ]);
//     //   }
//     // });

//     provider.on("sync", (isSynced: boolean) => {
//       if (isSynced && sharedType.length === 0) {
//         toSharedType(sharedType, [
//           { children: [{ text: "Hello world!" }] },
//         ]);
//       }
//     });
  
//     provider.connect();
  
//     return () => {
//       provider.disconnect();
//     };
//   }, [provider]);

//   return(
//     <Plate<MyValue>
//       editor={editor}
//       onChange={setValue}
//     editableProps={editableProps}
//     //initialValue={[...basicElementsValue, ...basicMarksValue]}
//     plugins={plugins}
//   >
//      value: {JSON.stringify(value)}</Plate>
//   )

  
  
// };
// export default Editor;



