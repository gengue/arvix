import PocketBase from "pocketbase";
import type { TypedPocketBase } from "./pb.types";

const pb = new PocketBase("http://127.0.0.1:8090") as TypedPocketBase;
// pb.autoCancellation(false);

export default pb;
