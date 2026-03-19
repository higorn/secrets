package io.esecrets.capacitor.autofill;

import org.junit.Test;

import java.sql.Timestamp;
import java.time.LocalDate;

public class DateParseTest {

  @Test
  public void shouldParteADate() {
    String dtStr = "2023-06-13T19:00:27.281-00:00";
    LocalDate date = LocalDate.parse(dtStr.substring(0, dtStr.indexOf("T")));
    System.out.println(date);
    Timestamp timestamp = Timestamp.valueOf(dtStr.replace("T", " ").substring(0, dtStr.indexOf(".")));
    System.out.println(timestamp);
  }
}
