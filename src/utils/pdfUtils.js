import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getUserTypeName } from "./userHelpers";

export const generateUserReport = (users) => {
  console.log("users", users);

  const docDefinition = {
    pageOrientation: "landscape",
    pageSize: "A4",
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
      lineHeight: 1.5,
    },
    content: [
      { text: "Redkey Research - User Management Report", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: ["20%", "15%", "10%", "15%", "10%", "30%"],
          body: [
            [
              { text: "Name", style: "tableHeader", margin: [0, 5, 0, 5] },
              { text: "Firm", style: "tableHeader", margin: [0, 5, 0, 5] },
              { text: "Type", style: "tableHeader", margin: [0, 5, 0, 5] },
              {
                text: "Registration",
                style: "tableHeader",
                margin: [0, 5, 0, 5],
              },
              {
                text: "Last Login",
                style: "tableHeader",
                margin: [0, 5, 0, 5],
              },
              { text: "Accesses", style: "tableHeader", margin: [0, 5, 0, 5] },
            ],
            ...users.map((user) => [
              {
                text: `${user.first_name} ${user.last_name}\n${user.email}`,
                fontSize: 9,
                margin: [0, 3, 0, 3],
              },
              {
                text: user.company || "no data",
                fontSize: 9,
                margin: [0, 3, 0, 3],
              },
              {
                text: getUserTypeName(user.role),
                fontSize: 9,
                margin: [0, 3, 0, 3],
              },
              {
                text: `${new Date(user.created_at).toLocaleDateString()}\nby ${
                  user.creator?.first_name || "system"
                } ${user.creator?.last_name || ""}`,
                fontSize: 9,
                margin: [0, 3, 0, 3],
              },
              {
                text: user.last_login
                  ? new Date(user.last_login).toLocaleDateString("en-US")
                  : new Date(user.created_at).toLocaleDateString("en-US"),
                fontSize: 9,
                margin: [0, 3, 0, 3],
              },
              {
                text: user.access?.map((a) => a.firm.name).join(", ") || "None",
                fontSize: 9,
                margin: [0, 3, 0, 3],
              },
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },
    ],
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
        fillColor: "#eeeeee",
      },
    },
  };

  pdfMake.createPdf(docDefinition).download("user-report.pdf");
};
