import { redirect } from "next/navigation";
import { GUIDE_BASE_PATH } from "./guide-config";

export default function GuidesPage() {
  redirect(`${GUIDE_BASE_PATH}/getting-started`);
}
