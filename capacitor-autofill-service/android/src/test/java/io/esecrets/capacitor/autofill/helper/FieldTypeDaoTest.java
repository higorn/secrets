package io.esecrets.capacitor.autofill.helper;

import android.os.Build;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.ParameterizedRobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import io.esecrets.capacitor.autofill.data.dao.FieldTypeDao;
import io.esecrets.capacitor.autofill.data.model.FieldType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(ParameterizedRobolectricTestRunner.class)
@Config(sdk = {Build.VERSION_CODES.P})
public class FieldTypeDaoTest {

  private FieldTypeDao fieldTypeDao;
  private String[] hints;
  private String expectedFieldTypeName;

  @ParameterizedRobolectricTestRunner.Parameters(name = "Field = {1}")
  public static Collection data() {
    return Arrays.asList(new Object[][] {
        {new String[] {"user", "username"}, "username"},
        {new String[] {"login"}, "username"},
        {new String[] {"passwd"}, "password"},
        {new String[] {"pwd"}, "password"},
        {new String[] {"pass"}, "password"},
        {new String[] {"secret", "pin"}, "password"},
        {new String[] {"one-time-code"}, "password"},
        {new String[] {"new-password"}, "password"},
        {new String[] {"current-password"}, "password"},
        {new String[] {"fullname"}, "fullname"},
        {new String[] {"given-name"}, "fullname"},
        {new String[] {"familly-name"}, "fullname"},
        {new String[] {"email"}, "mail"},
        {new String[] {"street-address"}, "address1"},
        {new String[] {"address-line1"}, "address1"},
        {new String[] {"address-level1"}, "address1"},
        {new String[] {"address-line2"}, "address2"},
        {new String[] {"address-level2"}, "address2"},
        {new String[] {"address-line3"}, "postalcode"},
        {new String[] {"address-level3"}, "postalcode"},
        {new String[] {"zipcode"}, "postalcode"},
        {new String[] {"address-line4"}, "city"},
        {new String[] {"address-level4"}, "city"},
        {new String[] {"city", ""}, "city"},
    });
  }

  public FieldTypeDaoTest(String[] hints, String expectedFieldTypeName) {
    this.hints = hints;
    this.expectedFieldTypeName = expectedFieldTypeName;
  }

  @Before
  public void setUp() {
    fieldTypeDao = FieldTypeDao.getInstance(RuntimeEnvironment.application.getResources());
  }

  @Test
  public void shouldLoadTheFieldTypes() {
    List<FieldType> fieldTypes = fieldTypeDao.getFieldTypes();
    assertNotNull(fieldTypes);
    assertEquals(28, fieldTypes.size());
    assertEquals("username", fieldTypes.get(0).name);
  }

  @Test
  public void shouldFindFieldTypesByHints() {
    List<FieldType> fieldTypes = fieldTypeDao.findFieldTypeByHints(hints);
    assertNotNull(fieldTypes);
    assertEquals(1, fieldTypes.size());
    assertEquals(expectedFieldTypeName, fieldTypes.get(0).name);
  }
}

