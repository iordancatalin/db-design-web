import * as $ from "jquery";
import { Dimension } from "../class/graphics/dimension";

export function getElementHeight ( element ): number
{ return $ ( element ).height (); }

export function getElementWidth ( element ): number
{ return $ ( element ).width (); }

export function getTableWidth ( id: string ): number
{ return $ ( '#' + id ).find ( '.table-wrapper' ).width (); }

export function getTableHeight ( id: string ): number
{ return $ ( '#' + id ).find ( '.table-wrapper' ).height (); }

export function requestFocusOnTable ( id: string ): void
{ $ ( '#' + id ).focus (); }

export function requestFocusOnElement ( element ): void
{ $ ( element ).focus (); }

export function getElementOffset ( element ): any
{ return $ ( element ).offset (); }

export function getElementOffsetById ( id ): any
{ return $ ( '#' + id ).offset (); }

export function getElementPosition ( element ): any
{ return $ ( element ).position (); }

export function getTableOptionsDimension ( id: string ): Dimension
{
  const element = $ ( '#' + id ).find ( '.table-options-panel' ).first ();

  return new Dimension ( element.width (), element.height () );
}

export function getSelectElementValue ( element ): string
{ return $ ( element ).val (); }
