import { Pipe, PipeTransform } from '@angular/core';
import { DepConcert } from 'src/types/concert.model';

@Pipe({
  name: 'filterConcerts',
})
export class FilterConcertsPipe implements PipeTransform {

  /**
   * Function filters contract concerts based on phrase
   * 
   * @param concerts - All concerts
   * @param searchText - Phrase to search for
   * @returns Filtered concerts
   *
   */
  transform(concerts: DepConcert[], searchText: string): DepConcert[] {
    if (!concerts) {
      return [];
    }
    if (!searchText) {
      return concerts;
    }
    searchText = searchText.toLocaleLowerCase();

    return concerts.filter((concert) => {
      return concert.name.toLocaleLowerCase().includes(searchText);
    });
  }
}
