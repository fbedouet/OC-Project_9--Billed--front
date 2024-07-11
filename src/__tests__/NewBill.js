/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
//import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import router from "../app/Router.js";
import { ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";


beforeEach( ()=> {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
  const root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.append(root)
  router()
  window.onNavigate(ROUTES_PATH.NewBill)
})

describe("Given I am connected as an employee", ()=> {
  describe("When I am on NewBill Page", ()=> {
    test("Then bill icon in vertical layout should be highlighted", ()=> {
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains("active-icon")).toBe(true)
    })

    test("Then NewBill should be added on send button click", async ()=> {
      const inputExpanseName = screen.getByTestId("expense-name")
      fireEvent.change(inputExpanseName,{target:{value:"Vol Nantes Paris"}})

      const inputDate = screen.getByTestId("datepicker")
      fireEvent.change( inputDate, {target:{value:"2024-06-21"}})

      const inputAmount = screen.getByTestId("amount")
      fireEvent.change(inputAmount,{target:{value:"1024"}})
      
      const inputPct = screen.getByTestId("pct")
      fireEvent.change(inputPct,{target:{value:"20"}})

      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['Facture'], 'facture.png', {type: 'image/png'})
      userEvent.upload(inputFile, fakeFile)
      
      console.log(document.querySelector(`input[data-testid="file"]`).file)

    })
  })
})