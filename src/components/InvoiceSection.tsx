import React, { forwardRef } from "react";
import css from "@/styles/InvoiceSection.module.scss";
import { InvoicePropsType } from "../../types";
import logo from "@/assets/images/epail-logo.png";
import { Table } from "semantic-ui-react";
import { formatToCurrency, sumAndFormatTotal, sumTotal } from "@/utils/utils";

const InvoiceSection = forwardRef<HTMLDivElement, InvoicePropsType>(
  ({ invoiceDetails }, ref) => {
    const materialsVATAmount =
      invoiceDetails.materials.length > 0 ? invoiceDetails.vat : 0;
    const totalMaterialsAmount =
      Number(sumTotal(invoiceDetails.materials.map((m) => m["unit price"]))) +
      materialsVATAmount;

    const labourCostsVATAmount =
      invoiceDetails.labourCosts.length > 0 ? invoiceDetails.vat : 0;
    const totalLabourCostsAmount =
      Number(sumTotal(invoiceDetails.labourCosts.map((m) => m["unit price"]))) +
      labourCostsVATAmount;
    const totalCostOfJob = totalLabourCostsAmount + totalMaterialsAmount;

    return (
      <div className={css["invoice-section"]} ref={ref}>
        <div className={css["head-section"]}>
          <ul className={css["invoice-details"]}>
            <li>
              <span>Invoice number: </span>
              <span>#97789190</span>
            </li>
            <li>
              <span>Date issued: </span>
              <span>{new Date().toLocaleDateString()}</span>
            </li>
          </ul>
          <div className={css["logo-container"]}>
            <img src={logo.src} alt="logo" />
          </div>
        </div>
        <hr />
        <div className={css["address-section"]}>
          <div className={css["customer-details"]}>
            <span>Receipient</span>
            <ul>
              <li>
                <span>{invoiceDetails.customerName}</span>
              </li>
              <li>
                <span>{invoiceDetails.customerAddress}</span>
              </li>
              <li>
                <span>{invoiceDetails.customerPhone}</span>
              </li>
              <li>
                <span>{invoiceDetails.customerEmail}</span>
              </li>
            </ul>
          </div>
          <div className={css["company-container"]}>
            <span>Sender</span>
            <ul>
              <li>
                <span>Epail</span>
              </li>
              <li>
                <span>KM 40, Orimerunmu</span>
              </li>
              <li>
                <span>Lagos-Ibadan</span>
              </li>
              <li>
                <span>Expressway Ogun state.</span>
              </li>
            </ul>
          </div>
        </div>
        <ul className={css["job-details"]}>
          <span>Job details</span>
          <br />
          <li>
            <span>Job number: </span>
            <span>{invoiceDetails.jobNumber}</span>
          </li>
          <li>
            <span>Date recieved: </span>
            <span>
              {new Date(invoiceDetails.dateReceived || "").toLocaleString()}
            </span>
          </li>
          <li>
            <span>Date to be completed: </span>
            <span>
              {new Date(
                invoiceDetails.dateTobeCompleted || ""
              ).toLocaleString()}
            </span>
          </li>
          <li>
            <span>Instruction taken by: </span>
            <span>{invoiceDetails.instructionTakenBy}</span>
          </li>
          <li>
            <span>Job done by: </span>
            <span>{invoiceDetails.jobDoneBy}</span>
          </li>
          <li>
            <span>Time started: </span>
            <span>{invoiceDetails.timeStarted}</span>
          </li>
          <li>
            <span>Time completed: </span>
            <span>{invoiceDetails.timeCompleted}</span>
          </li>
        </ul>
        <div className={css.materials}>
          <span>Materials</span>
          <Table celled structured>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Unit price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {invoiceDetails.materials.map((material) => (
                <Table.Row>
                  <Table.Cell>{material.description}</Table.Cell>
                  <Table.Cell>
                    {formatToCurrency(material["unit price"])}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell rowSpan={2}></Table.HeaderCell>
                <Table.HeaderCell collapsing>
                  <span className={css["span-title"]}>Sub total: </span>
                  <span>
                    {sumAndFormatTotal(
                      invoiceDetails.materials.map((m) => m["unit price"])
                    )}
                  </span>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell collapsing>
                  <span className={css["span-title"]}>VAT: </span>
                  <span>{formatToCurrency(materialsVATAmount)}</span>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell collapsing colSpan={2}>
                  <span className={css["span-title"]}>Total: </span>
                  <span>{formatToCurrency(totalMaterialsAmount)}</span>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
        <div className={css["labour-costs"]}>
          <span>Labour costs</span>
          <Table celled structured>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Unit price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {invoiceDetails.labourCosts.map((material) => (
                <Table.Row>
                  <Table.Cell>{material.description}</Table.Cell>
                  <Table.Cell>
                    {formatToCurrency(material["unit price"])}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell rowSpan={2}></Table.HeaderCell>
                <Table.HeaderCell collapsing>
                  <span className={css["span-title"]}>Sub total: </span>
                  <span>
                    {sumAndFormatTotal(
                      invoiceDetails.labourCosts.map((lc) => lc["unit price"])
                    )}
                  </span>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell collapsing>
                  <span className={css["span-title"]}>VAT: </span>
                  <span>{formatToCurrency(labourCostsVATAmount)}</span>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell collapsing colSpan={2}>
                  <span className={css["span-title"]}>Total: </span>
                  <span>{formatToCurrency(totalLabourCostsAmount)}</span>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
        <Table>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell textAlign="right">
                <span className={css["span-title"]}>Total: </span>
                <span>{formatToCurrency(totalCostOfJob)}</span>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    );
  }
);

export default InvoiceSection;
