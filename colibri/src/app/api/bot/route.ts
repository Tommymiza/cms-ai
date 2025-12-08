import { getHostServerSide } from "@/lib/gethost";
import { Site } from "@/stores/site/type";
import { type UIMessage } from "ai";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getSite } from "./function";
import { standard } from "./standard";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const header = await headers();
    const hostRes = header.get("host");
    const host = getHostServerSide(hostRes);
    if (!host) {
      return NextResponse.json(
        { success: false, error: "Host not found" },
        {
          status: 500,
          statusText: "Internal server error",
        }
      );
    }
    const {
      messages,
      token,
      pathname,
      tenant,
    }: {
      messages: UIMessage[];
      token: string;
      pathname: string;
      tenant: number;
    } = await req.json();
    let site: Site = await getSite(token, host);
    const page = site.pages?.find((d) => d.path === pathname);
    const transformedSite = {
      ...site,
      pages: site.pages?.map((p) => {
        const { blocks, parent, children, ...rest } = p;
        return {
          ...rest,
          parent: parent ? parent.id : null,
        };
      }),
    };
    return await standard({
      messages,
      site: transformedSite,
      page,
      token,
      tenant,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: error.message },
      {
        status: 500,
        statusText: "Internal server error",
      }
    );
  }
}
